import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ItemsService } from 'src/items/items.service';
import KindEnum from 'src/enum/kind.enum';
import { TagRepository } from './tags.repository';
import { CommonTagVo } from './vo/common-tag.vo';
import { FindAllTagsVo } from './vo/find-all-tags.vo';

interface IFindAllPayload {
  userId: number;
  page: number;
  pageSize: number;
  kind?: KindEnum;
}

@Injectable()
export class TagsService {
  @Inject(TagRepository)
  private tagRepository: TagRepository;

  @Inject(ItemsService)
  private itemService: ItemsService;

  async create(createTagDto: CreateTagDto): Promise<CommonTagVo> {
    const resource = await this.tagRepository.save(createTagDto);
    return { resource };
  }

  async findAll({
    userId,
    page,
    pageSize,
    kind,
  }: IFindAllPayload): Promise<FindAllTagsVo> {
    const query = this.tagRepository.commonQuery(userId, kind);
    const resources = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
    const count = await query.getCount();
    return { resources, count, page, pageSize };
  }

  async findOne(userId: number, id: number): Promise<CommonTagVo> {
    const resource = await this.tagRepository
      .commonQueryById(userId, id)
      .getOne();
    return { resource };
  }

  async update(
    userId: number,
    id: number,
    updateTagDto: UpdateTagDto,
  ): Promise<CommonTagVo> {
    const query = this.tagRepository.commonQueryById(userId, id);
    const existed = await query.getExists();
    if (!existed) {
      throw new BadRequestException('不能更新不存在的数据');
    }

    await this.tagRepository.save({ id, ...updateTagDto });
    // ! save 只返回了有变动的部分字段，故需要重新查找
    const resource = await query.getOne();
    return { resource };
  }

  async remove(userId: number, id: number) {
    const record = await this.tagRepository
      .commonQueryById(userId, id)
      .leftJoinAndSelect('tag.items', 'i')
      .getOne();

    if (!record) {
      throw new BadRequestException('不能删除不存在的数据');
    }

    // 删除标签关联的收支记录
    record.items.forEach(
      async (i) => await this.itemService.remove(userId, i.id),
    );

    return this.tagRepository.softDelete(id);
  }
}
