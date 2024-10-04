import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query
} from '@nestjs/common'
import { TagsService } from './tags.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { UserId } from 'src/user-id/user-id.decorator'
import KindEnum from 'src/enum/kind.enum'
import { Doc } from 'src/doc/doc.decorator'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Doc('createTag')
  @Post()
  create(@UserId() userId: number, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.create({
      userId,
      ...(createTagDto || {})
    } as CreateTagDto)
  }

  @Doc('findAllTags')
  @Get()
  findAll(
    @UserId() userId: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('kind') kind?: KindEnum
  ) {
    return this.tagsService.findAll({
      userId,
      page: +page,
      pageSize: +pageSize,
      kind: +kind
    })
  }

  @Doc('findOneTag')
  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.tagsService.findOne(userId, +id)
  }

  @Doc('updateTag')
  @Patch(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto
  ) {
    return this.tagsService.update(userId, +id, updateTagDto)
  }

  @Doc('deleteTag')
  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.tagsService.remove(userId, +id)
  }
}
