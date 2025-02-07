import { Controller,Get, Param,Post ,Body, Patch, Delete, ParseIntPipe, HttpStatus, UsePipes, ValidationPipe, UnauthorizedException, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './create-user.dto';
import { User } from './user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.User,Role.Admin)
  @Get()
  findAll():Promise<ApiResponse<any>>
   {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDTO): Promise<ApiResponse<any>> {
    return this.userService.createUser(
      createUserDto.id,
      createUserDto.email,
      createUserDto.password,
      createUserDto.role,
      createUserDto.isActive,
    );
  }
  @Get(':id')
  findById(@Param('id') id: number): Promise<ApiResponse<any>> | null {
    return this.userService.findById(+id);
  }
  
   @Roles(Role.Admin)
   @UseGuards(AuthGuard)
   @Delete(':id')
   removeUser(@Param('id') id: number):Promise<ApiResponse<any>> {
               return this.userService.removeUser(+id);
  }
}
