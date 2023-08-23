import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemsService } from 'src/items/items.service';
import KindEnum from 'src/enum/kind.enum';

interface IFindAllPayload {
  userId: number;
  page: number;
  pageSize: number;
  kind?: KindEnum;
}

@Injectable()
export class TagsService {
  @InjectRepository(TagEntity)
  private tagRepository: Repository<TagEntity>;

  @Inject(ItemsService)
  private itemService: ItemsService;

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.save(createTagDto);
  }

  async findAll({ userId, page, pageSize, kind }: IFindAllPayload) {
    const where = { userId, ...(kind ? { kind } : {}) };
    const list = await this.tagRepository.find({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const count = await this.tagRepository.count({ where });
    return { resources: list, count, page, pageSize };
  }

  findOne(id: number) {
    return this.tagRepository.findOneBy({ id });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const existed = await this.tagRepository.exist({ where: { id } });
    if (!existed) {
      throw new BadRequestException('不能更新不存在的数据');
    }

    await this.tagRepository.save({ id, ...updateTagDto });
    // ! save 只返回了有变动的部分字段，故需要重新查找
    return this.tagRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const record = await this.tagRepository.findOne({
      where: { id },
      relations: { items: true },
    });

    if (!record) {
      throw new BadRequestException('不能删除不存在的数据');
    }

    // 删除标签关联的收支记录
    record.items.forEach((i) => this.itemService.remove(i.id));

    return this.tagRepository.softDelete(id);
  }
}
