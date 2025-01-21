import { NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction } from "express";
export default class LanguageMiddleware implements NestMiddleware{ 
      use(req: Request, res:Response, next: NextFunction) {
             console.log(req.headers["accept-language"]);
             console.log(req.headers.connection);
             console.log(req.headers.authorization);
             next()
      }
}