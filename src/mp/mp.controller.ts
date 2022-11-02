import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BufferedFile } from 'src/dto/file.dto';
import { MpService } from './mp.service';

@ApiTags('小程序端')
@Controller('mp')
export class MpController {
  constructor(private readonly mpService: MpService) {}
  /**
   * 上传图片
   * @param image 图片二进制
   * @returns
   */
  @ApiOperation({ description: '图片文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/upload/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() imageFile: BufferedFile) {
    return this.mpService.uploadImage(imageFile);
  }

  /**
   * 订阅服务器校验
   */
  @ApiOperation({ description: '订阅服务器校验' })
  @Get('/check_signature')
  checkSignature(
    @Query('signature') signature,
    @Query('timestamp') timestamp,
    @Query('nonce') nonce,
    @Query('echostr') echostr,
  ) {
    return this.mpService.checkSignature(signature, timestamp, nonce, echostr);
  }
}
