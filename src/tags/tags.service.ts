import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

// TODO: 错误处理
// 要更新的数据不存在
// 要更新的数据已被删除，不能再更新
// 重复删除
@Injectable()
export class TagsService {
  @InjectRepository(TagEntity)
  private tagRepository: Repository<TagEntity>;

  async create(createTagDto: CreateTagDto) {
    // const newTag = this.tagRepository.create();
    // newTag.userId = createTagDto.userId
    // newTag.name = createTagDto.name
    // newTag.sign = createTagDto.sign
    // newTag.kind = createTagDto.kind; // Assign an enum value
    // 以上等效于
    const newTag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(newTag);
    return newTag;
  }

  findAll() {
    return this.tagRepository.find()
  }

  findOne(id: number) {
    return this.tagRepository.findOneBy({ id })
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    await this.tagRepository.save({ id, ...updateTagDto })
    // ! save 只返回了有变动的部分字段，故需要重新查找
    return this.tagRepository.findOneBy({ id })
  }

  remove(id: number) {
    return this.tagRepository.softDelete(id)
  }
}
