import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { ItemsModule } from 'src/items/items.module';
import { TagRepository } from './tags.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), ItemsModule],
  controllers: [TagsController],
  providers: [TagsService, TagRepository],
})
export class TagsModule {}
