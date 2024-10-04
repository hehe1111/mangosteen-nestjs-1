import {
  Body,
  Controller,
  DefaultValuePipe,
  Inject,
  Post
} from '@nestjs/common'
import { SendValidationCodesDto } from './dto/validation-codes.dto'
import { ValidationCodesKindEnum } from './enum/validation-codes.enum'
import { ValidationCodesService } from './validation-codes.service'
import { Doc } from 'src/doc/doc.decorator'

@Controller('validation_codes')
export class ValidationCodesController {
  @Inject(ValidationCodesService)
  private validationCodesService: ValidationCodesService

  @Doc('sendValidationCodes')
  // async sendValidationCodes(@Body('email') email: string, @Body('kind', new DefaultValuePipe(ValidationCodesKindEnum.SIGN_IN)) kind: ValidationCodesKindEnum) {
  //   await this.validationCodesService.sendValidationCodes(payload)
  //   return '成功发送验证码，请到邮箱中查看验证码'
  // }
  @Post()
  async sendValidationCodes(@Body() payload: SendValidationCodesDto) {
    await this.validationCodesService.sendValidationCodes(payload)
    return '成功发送验证码，请到邮箱中查看验证码'
  }
}
