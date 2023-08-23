// TODO: 分页：tags items
// TODO: 统计接口
// TODO: 按 kind 时间范围 用户id 查询
// TODO: 格式化响应 resource / resources

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  @InjectRepository(ItemEntity)
  private itemRepository: Repository<ItemEntity>;

  async create(createItemDto: CreateItemDto) {
    return this.itemRepository.save(createItemDto);
  }

  async findAll() {
    // return this.itemRepository.findAndCount({ withDeleted: true })
    // findAndCount 会自动过滤 deletedAt 非空的数据
    const [list, total] = await this.itemRepository.findAndCount({
      relations: { tag: true },
    });
    return { resources: list, total };
  }

  findOne(id: number) {
    // findOneBy/findOne 会自动过滤 deletedAt 非空的数据
    // findOneBy 不能做关联查询，故改为 findOne
    return this.itemRepository.findOne({
      where: { id },
      relations: { tag: true },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    // exist 会自动过滤 deletedAt 非空的数据
    const existed = await this.itemRepository.exist({ where: { id } });
    if (!existed) {
      throw new BadRequestException('不能更新不存在的数据');
    }

    await this.itemRepository.save({ id, ...updateItemDto });
    // ! save 只返回了有变动的部分字段，故需要重新查找
    // findOneBy 不能做关联查询，故改为 findOne
    return this.itemRepository.findOne({
      where: { id },
      relations: { tag: true },
    });
  }

  async remove(id: number) {
    // findOneBy 会自动过滤 deletedAt 非空的数据，因此不存在重复删除
    const record = await this.itemRepository.findOneBy({ id });

    if (!record) {
      throw new BadRequestException('不能删除不存在的数据');
    }

    return this.itemRepository.softDelete(id);
  }
}
