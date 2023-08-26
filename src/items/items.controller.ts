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
import GroupByEnum from 'src/enum/group-by.enum';
import { Doc } from 'src/doc/doc.decorator';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Doc('createItem')
  @Post()
  create(@UserId() userId: number, @Body() createItemDto: CreateItemDto) {
    return this.itemsService.create({
      userId,
      ...(createItemDto || {}),
    } as CreateItemDto);
  }

  @Doc('findAllItems')
  @Get()
  findAll(
    @UserId() userId: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('kind') kind?: KindEnum,
    @Query('happenedAfter') happenedAfter?: Date,
    @Query('happenedBefore') happenedBefore?: Date,
  ) {
    return this.itemsService.findAll({
      userId,
      page: +page,
      pageSize: +pageSize,
      kind: +kind,
      happenedAfter,
      happenedBefore,
    });
  }

  @Doc('summaryItem')
  // ! 这个接口必须放到 @Get(':id') 前，否则 /summary 会被 @Get(':id') 拦截，就不会命中 @Get('summary')
  @Get('summary')
  summary(
    @UserId() userId: number,
    @Query('group_by', new DefaultValuePipe(GroupByEnum.HappenedAt))
    groupBy: GroupByEnum,
    @Query('kind') kind?: KindEnum,
    @Query('happenedAfter') happenedAfter?: Date,
    @Query('happenedBefore') happenedBefore?: Date,
  ) {
    return this.itemsService.summary({
      userId,
      groupBy,
      kind: +kind,
      happenedAfter,
      happenedBefore,
    });
  }

  @Doc('balanceItem')
  @Get('balance')
  balance(
    @UserId() userId: number,
    @Query('happenedAfter') happenedAfter?: Date,
    @Query('happenedBefore') happenedBefore?: Date,
  ) {
    return this.itemsService.balance({
      userId,
      happenedAfter,
      happenedBefore,
    });
  }

  @Doc('findOneItem')
  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.itemsService.findOne(userId, +id);
  }

  @Patch(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(userId, +id, updateItemDto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.itemsService.remove(userId, +id);
  }
}
