import { Body, Controller, Post,UseGuards,Get,Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/users/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async signIn(@Body() payload: Record<string, any>) {
        return await this.authService.singIN(payload.email, payload.password)   
  }
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

