// TODO: 统计接口
// TODO: 按 时间范围 查询
// TODO: 格式化响应 resource / resources

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
    return this.itemRepository.save(createItemDto);
  }

  async findAll({ userId, page, pageSize, kind }: IFindAllPayload) {
    const query = this.itemRepository.commonQuery(userId, kind);
    const list = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .leftJoinAndSelect('item.tag', 't') // 获取关联标签
      .getMany(); // 注意调用这一行
    const count = await query.getCount();
    return { resources: list, count, page, pageSize };
  }

  findOne(userId: number, id: number) {
    return this.itemRepository
      .commonQueryById(userId, id)
      .leftJoinAndSelect('item.tag', 't')
      .getOne();
  }

  async update(userId: number, id: number, updateItemDto: UpdateItemDto) {
    const query = this.itemRepository.commonQueryById(userId, id);
    const existed = await query.getExists();
    if (!existed) {
      throw new BadRequestException('不能更新不存在的数据');
    }

    await this.itemRepository.save({ id, ...updateItemDto });
    // ! save 只返回了有变动的部分字段，故需要重新查找
    return query.leftJoinAndSelect('item.tag', 't').getOne();
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
