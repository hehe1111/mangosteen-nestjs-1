import { Module } from '@nestjs/common';
import { ValidationCodesController } from './validation-codes.controller';
import { ValidationCodesService } from './validation-codes.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [ValidationCodesController],
  providers: [ValidationCodesService],
})
export class ValidationCodesModule {}
