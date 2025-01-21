import { Injectable,NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction, request } from "express";
export class AuthMiddleware implements NestMiddleware{
      use(req:Request,res:Response,next:NextFunction){
             console.log(req.headers['accept-language']);
             console.log(req['language']);
             res.setHeader('X-customeHeader','CustomeHeaderValue')
             console.log(req.headers);
            next()
      }
}