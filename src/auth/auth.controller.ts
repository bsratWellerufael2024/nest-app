import { Body, Controller, Post,UseGuards,Get,Request} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/users/create-user.dto';
import { HttpException,HttpStatus } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  
  @Post('login')
  async signIn(@Body() payload: Record<string, any>) {
    // return this.authService.singIN(payload.email, payload.password);
      try {
        return await this.authService.singIN(payload.email, payload.password);
      } catch (error) {
        console.error('Login Error:', error.message); // Log the error
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

  }
  @ApiOperation({
    summary: 'protected Route',
    description: 'this route is protected so u should have signin',
  })
  @ApiResponse({status:200,description:'ur profile',example:CreateUserDTO})
  // @UseGuards(AuthGuard)

  // @Roles(['admin'])
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

