import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'


// TODO: 错误处理
// name 过长
// sign 过长
// 必填字段为空
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
    // 等价于
    // return this.tagRepository.findOne({ where: { id } })
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    // save：数据库不存在该数据，则新增，否则更新
    await this.tagRepository.save({ id, ...updateTagDto })
    // 成功结果示例
    // {
    //   "id": 2,
    //   "name": "游泳 2==",
    //   "kind": 1,
    //   "deletedAt": null,
    //   "updatedAt": "2023-08-13T04:23:41.000Z"
    // }
    // ! save 只返回了有变动的部分字段，故需要重新查找
    return this.tagRepository.findOneBy({ id })
  }

  remove(id: number) {
    // ! delete 会直接删除记录
    // return this.tagRepository.delete(id)
    // 成功结果示例
    // {
    //   "raw": [],
    //   "affected": 1
    // }
    // ! 软删除
    this.tagRepository.save({ id, deletedAt: new Date() })
    // ! save 只返回了部分字段，故重新查找
    return this.tagRepository.findOneBy({ id })
  }
}
