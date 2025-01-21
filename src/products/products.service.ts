import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private repository: Repository<Products>,
  ) {}
   
  async createProduct(productId:number,productName:string,price:number):Promise<Products>{
      const newProduct= await this.repository.create({productId,productName,price})
      return  this.repository.save(newProduct)
  }

  getAllProducts():Promise<Products[]>{
     return this.repository.find()
  }
  async updateProduct(productid:number,updatedData:Partial<Products>){
    const result= await this.repository.update(productid,updatedData)
      if(result.affected===0){
         throw new NotFoundException('Prouct not found')
      }
      return result
  }

 async removeProduct(productId:number):Promise<void>{
      await this.repository.delete({productId})
  }
}

