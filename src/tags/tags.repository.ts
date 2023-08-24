import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import KindEnum from 'src/enum/kind.enum';

// https://stackoverflow.com/a/73239250
// https://orkhan.gitbook.io/typeorm/docs/custom-repository#how-to-create-custom-repository
// https://devpress.csdn.net/mongodb/62fc856f7e6682346618fef8.html
// 参考以上链接得出来的写法

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  // ! constructor 里的是固定写法
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {
    super(
      tagRepository.target,
      tagRepository.manager,
      tagRepository.queryRunner,
    );
  }

  commonQuery(userId: number, kind?: KindEnum) {
    let builder = this.tagRepository
      .createQueryBuilder('tag') // 参数是「别名」，方便写后续链式调用里的 sql 语句
      .orderBy('tag.createdAt', 'DESC')
      .where('tag.userId = :userId', { userId });
    kind && (builder = builder.andWhere('tag.kind = :kind', { kind }));
    return builder;
  }

  commonQueryById(userId: number, id: number) {
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.userId = :userId', { userId })
      .andWhere('tag.id = :id', { id });
  }
}
