import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { UserId } from 'src/user-id/user-id.decorator';
import KindEnum from 'src/enum/kind.enum';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@UserId() userId: number, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.create({
      userId,
      ...(createTagDto || {}),
    } as CreateTagDto);
  }

  @Get()
  findAll(
    @UserId() userId: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('kind') kind?: KindEnum,
  ) {
    return this.tagsService.findAll({
      userId,
      page: +page,
      pageSize: +pageSize,
      kind,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
