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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { UserId } from 'src/user-id/user-id.decorator';
import KindEnum from 'src/enum/kind.enum';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@UserId() userId: number, @Body() createItemDto: CreateItemDto) {
    return this.itemsService.create({
      userId,
      ...(createItemDto || {}),
    } as CreateItemDto);
  }

  @Get()
  findAll(
    @UserId() userId: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('kind') kind?: KindEnum,
  ) {
    return this.itemsService.findAll({
      userId,
      page: +page,
      pageSize: +pageSize,
      kind,
    });
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.itemsService.findOne(userId, +id);
  }

  @Patch(':id')
  update(@UserId() userId: number, @Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(userId, +id, updateItemDto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.itemsService.remove(userId, +id);
  }
}
