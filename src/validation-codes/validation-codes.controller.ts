import {
  Body,
  Controller,
  DefaultValuePipe,
  Inject,
  Post,
} from '@nestjs/common';
import { SendValidationCodesDto } from './dto/validation-codes.dto';
import { VALIDATION_CODES_KIND } from './enum/validation-codes.enum';
import { ValidationCodesService } from './validation-codes.service';

@Controller('validation_codes')
export class ValidationCodesController {
  @Inject(ValidationCodesService)
  private validationCodesService: ValidationCodesService;

  // @Post()
  // async sendValidationCodes(@Body('email') email: string, @Body('kind', new DefaultValuePipe(VALIDATION_CODES_KIND.SIGN_IN)) kind: VALIDATION_CODES_KIND) {
  //   await this.validationCodesService.sendValidationCodes(payload)
  //   return '成功发送验证码'
  // }
  @Post()
  async sendValidationCodes(@Body() payload: SendValidationCodesDto) {
    await this.validationCodesService.sendValidationCodes(payload);
    return '成功发送验证码';
  }
}
