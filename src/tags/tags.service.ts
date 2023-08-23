import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class TagsService {
  @InjectRepository(TagEntity)
  private tagRepository: Repository<TagEntity>;

  @Inject(ItemsService)
  private itemService: ItemsService;

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.save(createTagDto);
  }

  async findAll() {
    // return this.tagRepository.findAndCount({ withDeleted: true })
    // findAndCount 会自动过滤 deletedAt 非空的数据
    const [list, total] = await this.tagRepository.findAndCount();
    return { resources: list, total }
  }

  findOne(id: number) {
    // findOneBy 会自动过滤 deletedAt 非空的数据
    return this.tagRepository.findOneBy({ id });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    // exist 会自动过滤 deletedAt 非空的数据
    const existed = await this.tagRepository.exist({ where: { id } });
    if (!existed) {
      throw new BadRequestException('不能更新不存在的数据');
    }

    await this.tagRepository.save({ id, ...updateTagDto });
    // ! save 只返回了有变动的部分字段，故需要重新查找
    return this.tagRepository.findOneBy({ id });
  }

  async remove(id: number) {
    // findOneBy 会自动过滤 deletedAt 非空的数据，因此不需要处理重复删除
    // findOneBy 不能做关联查询，故改为 findOne
    // 关联查询时，默认也会过滤 deletedAt 非空的数据
    const record = await this.tagRepository.findOne({ where: { id }, relations: { items: true } });

    if (!record) {
      throw new BadRequestException('不能删除不存在的数据');
    }

    // 删除标签关联的收支记录
    record.items.forEach(i => this.itemService.remove(i.id))
    // 删除标签
    return this.tagRepository.softDelete(id);
  }
}
