// TODO: 文档

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ICommonQuery, ItemRepository } from './items.repository';
import GroupByEnum from 'src/enum/group-by.enum';
import { TagEntity } from 'src/tags/entities/tag.entity';
import KindEnum from 'src/enum/kind.enum';

interface IItems extends ICommonQuery {
  page?: number;
  pageSize?: number;
  groupBy?: GroupByEnum;
}

@Injectable()
export class ItemsService {
  @Inject(ItemRepository)
  private itemRepository: ItemRepository;

  async create(createItemDto: CreateItemDto) {
    const resource = await this.itemRepository.save(createItemDto);
    return { resource };
  }

  async findAll({
    userId,
    page,
    pageSize,
    kind,
    happenedAfter,
    happenedBefore,
  }: IItems) {
    const query = this.itemRepository.commonQuery({
      userId,
      kind,
      happenedAfter,
      happenedBefore,
    });
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

  async summary({
    userId,
    groupBy,
    kind,
    happenedAfter,
    happenedBefore,
  }: IItems) {
    const list = await this.itemRepository
      .commonQuery({
        userId,
        kind,
        happenedAfter,
        happenedBefore,
      })
      .leftJoinAndSelect('item.tag', 't') // 获取关联标签
      .getMany();
    const hash: Record<string, number> = {};
    // 结果列表
    let resources = [];
    // 总金额
    let total = 0;
    if (groupBy === GroupByEnum.HappenedAt) {
      list.forEach((i) => {
        const date = new Date(i.happenedAt).toLocaleDateString();
        !hash[date] && (hash[date] = 0);
        hash[date] += i.amount;
        total += i.amount;
      });
      resources = Object.keys(hash).map((key) => ({
        happened_at: key,
        amount: hash[key],
      }));
    } else if (groupBy === GroupByEnum.TagId) {
      // 存储「标签ID:标签」键值对，方便后续构造结果数据
      const idTagHash: Record<string, TagEntity> = {};
      list.forEach((i) => {
        const tagId = `${i.tag.id}`;
        !hash[tagId] && (hash[tagId] = 0);
        hash[tagId] += i.amount;
        total += i.amount;
        // 暂存标签
        !idTagHash[tagId] && (idTagHash[tagId] = i.tag);
      });
      resources = Object.keys(hash).map((key) => ({
        tag: idTagHash[key],
        amount: hash[key],
      }));
    }
    return { resources, total };
  }

  async balance({ userId, happenedAfter, happenedBefore }: IItems) {
    const list = await this.itemRepository
      .commonQuery({
        userId,
        happenedAfter,
        happenedBefore,
      })
      .getMany();
    let expense = 0;
    let income = 0;
    list.forEach((i) => {
      if (i.kind === KindEnum.Expense) {
        expense += i.amount;
      } else if (i.kind === KindEnum.Income) {
        income += i.amount;
      }
    });
    return { expense, income, balance: income - expense };
  }
}
