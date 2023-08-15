import { HttpException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

@Injectable()
export class TagsService {
  @InjectRepository(TagEntity)
  private tagRepository: Repository<TagEntity>;

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.save(createTagDto);
  }

  findAll() {
    return this.tagRepository.find({ withDeleted: true })
  }

  findOne(id: number) {
    return this.tagRepository.findOneBy({ id })
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    // exist 会自动过滤 deletedAt 非空的数据
    const existed = await this.tagRepository.exist({ where: { id } })
    if (!existed) {
      throw new HttpException('不能更新不存在的数据', 400)
    }

    await this.tagRepository.save({ id, ...updateTagDto })
    // ! save 只返回了有变动的部分字段，故需要重新查找
    return this.tagRepository.findOneBy({ id })
  }

  async remove(id: number) {
    const record = await this.tagRepository.findOneBy({ id })

    if (!record) {
      throw new HttpException('不能删除不存在的数据', 400)
    }

    if (record.deletedAt) {
      throw new HttpException('重复删除', 400)
    }

    return this.tagRepository.softDelete(id)
  }
}
