import { Injectable ,UnauthorizedException} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
   constructor(private userService:UsersService,private jwtService:JwtService){}

   async singIN(email:string,pass:string):Promise<any>{
         const user=await this.userService.findByEmail(email)
         
         if(!user){
          throw new  UnauthorizedException('no user registered using this email')
         }
         
         const ValidPass = await bcrypt.compare(pass, user.password);
         if(!ValidPass){
            throw new UnauthorizedException('invalid password')
         }
        
      const payload={sub:user.id,email:user.email,role:user.role}
        return {
                 access_Token:await this.jwtService.signAsync(payload)
               }
   }
}
