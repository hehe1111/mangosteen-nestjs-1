// TODO: 统计接口
// TODO: 按 时间范围 查询

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import KindEnum from 'src/enum/kind.enum';
import { ItemRepository } from './items.repository';

interface IFindAllPayload {
  userId: number;
  page: number;
  pageSize: number;
  kind?: KindEnum;
}

@Injectable()
export class ItemsService {
  @Inject(ItemRepository)
  private itemRepository: ItemRepository;

  async create(createItemDto: CreateItemDto) {
    const resource = await this.itemRepository.save(createItemDto);
    return { resource };
  }

  async findAll({ userId, page, pageSize, kind }: IFindAllPayload) {
    const query = this.itemRepository.commonQuery(userId, kind);
    const resources = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .leftJoinAndSelect('item.tag', 't') // 获取关联标签
      .getMany(); // 注意调用这一行
    const count = await query.getCount();
    return { resources, count, page, pageSize };
  }

  async findOne(userId: number, id: number) {
    const resource = await this.itemRepository
      .commonQueryById(userId, id)
      .leftJoinAndSelect('item.tag', 't')
      .getOne();
    return { resource };
  }

  async update(userId: number, id: number, updateItemDto: UpdateItemDto) {
    const query = this.itemRepository.commonQueryById(userId, id);
    const existed = await query.getExists();
    if (!existed) {
      throw new BadRequestException('不能更新不存在的数据');
    }

    await this.itemRepository.save({ id, ...updateItemDto });
    // ! save 只返回了有变动的部分字段，故需要重新查找
    const resource = await query.leftJoinAndSelect('item.tag', 't').getOne();
    return { resource };
  }

  async remove(userId: number, id: number) {
    const existed = await this.itemRepository
      .commonQueryById(userId, id)
      .getExists();

    if (!existed) {
      throw new BadRequestException('不能删除不存在的数据');
    }

    return this.itemRepository.softDelete(id);
  }
}
