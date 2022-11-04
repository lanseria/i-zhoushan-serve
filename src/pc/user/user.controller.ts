import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PC端', '用户服务')
@Controller({
  path: 'pc/user',
})
export class UserController {
  @Post('/login')
  async login() {
    return {
      token: '12345',
    };
  }
}
