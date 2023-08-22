import { Module } from '@nestjs/common';
import { ValidationCodesController } from './validation-codes.controller';
import { ValidationCodesService } from './validation-codes.service';

@Module({
  controllers: [ValidationCodesController],
  providers: [ValidationCodesService]
})
export class ValidationCodesModule {}
