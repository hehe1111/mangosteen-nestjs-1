// TODO: 统计接口
// TODO: 按 时间范围 查询
// TODO: 格式化响应 resource / resources

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import KindEnum from 'src/enum/kind.enum';

interface IFindAllPayload {
  userId: number;
  page: number;
  pageSize: number;
  kind?: KindEnum;
}

@Injectable()
export class ItemsService {
  @InjectRepository(ItemEntity)
  private itemRepository: Repository<ItemEntity>;

  async create(createItemDto: CreateItemDto) {
    return this.itemRepository.save(createItemDto);
  }

  async findAll({ userId, page, pageSize, kind }: IFindAllPayload) {
    const where = { userId, ...(kind ? { kind } : {}) };
    const list = await this.itemRepository.find({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: { tag: true },
    });
    const count = await this.itemRepository.count({ where });
    return { resources: list, count, page, pageSize };
  }

  findOne(id: number) {
    return this.itemRepository.findOne({
      where: { id },
      relations: { tag: true },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const existed = await this.itemRepository.exist({ where: { id } });
    if (!existed) {
      throw new BadRequestException('不能更新不存在的数据');
    }

    await this.itemRepository.save({ id, ...updateItemDto });
    // ! save 只返回了有变动的部分字段，故需要重新查找
    return this.itemRepository.findOne({
      where: { id },
      relations: { tag: true },
    });
  }

  async remove(id: number) {
    const record = await this.itemRepository.findOneBy({ id });

    if (!record) {
      throw new BadRequestException('不能删除不存在的数据');
    }

    return this.itemRepository.softDelete(id);
  }
}
