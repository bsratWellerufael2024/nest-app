import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
     private userRepository:Repository<User>
  ){}
   
  findAll():Promise<User[]>{
    return this.userRepository.find()
  }

  async createUser(id:number,email:string,password:string,role:string,isActive:string):Promise<User>{
      const  hashedPassword=await bcrypt.hash(password,10)
      const newUser=this.userRepository.create({id,email,password:hashedPassword,role,isActive})
      return this.userRepository.save(newUser)
  }
  findById(id:number):Promise<User>|null{
    return this.userRepository.findOneBy({id})
  }

  async removeUser(id:number):Promise<void>{
     await this.userRepository.delete({id})
  }
  
  findByEmail(email:string):Promise<User>|null{
       return this.userRepository.findOneBy({email})   
  }

}
