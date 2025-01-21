import {Injectable,NestMiddleware} from '@nestjs/common'
import { Request,Response,NextFunction } from "express";
@Injectable()
export class LoggerMiddleware implements NestMiddleware{
  
       use(req:Request,res:Response,next:NextFunction){
          const{method,url}=req
          const timestamp=new Date().toISOString()
          console.log(`${timestamp}  ${method} ${url}`);
         console.log(res.getHeader['prototype']);
          next()
       }
} 