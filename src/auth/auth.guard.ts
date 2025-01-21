import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtContants } from './constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtSevice: JwtService,private reflector:Reflector) {}
  
  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // return type === 'Bearer' ? token : undefined;
     console.log('loged', token);
       return token
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
  
    const request = context.switchToHttp().getRequest();
    console.log("user object");
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('no token');
    }
    try {
      const payload = await this.jwtSevice.verifyAsync(token, {
        secret: jwtContants.secret,
      });
      request['user'] = payload;
       const requiredRoles=this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
             context.getClass(),
             context.getHandler()
          ]
      )
    
      if(!requiredRoles){
        return true
      }
      if(!payload ||!payload.role){
        return false
      }
      return requiredRoles.some(role=>payload.role===role)
      
    } catch {
      throw new UnauthorizedException('invalid token');
    }
    
   }
}
