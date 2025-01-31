import { HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './product.entity';
import { UnitCoversion } from 'src/unitconversion/unit.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private repository: Repository<Products>,

    @InjectRepository(UnitCoversion)
     private UnitConversion:Repository<UnitCoversion>
  ) {}

  async createProduct(
    productId: number,
    productName: string,
    costPerUnit: number,
    specification: string,
    baseUnit: string,
    catagory: string,
    openingQty: number,
  ): Promise<Products> {
    const newProduct = await this.repository.create({
      productId,
      productName,
      costPerUnit,
      specification,
      baseUnit,
      catagory,
      openingQty
    });

    return this.repository.save(newProduct);
  }


  async newIncoming(productId: number, qty: number, cost: number) {
    const product = await this.repository.findOneBy({ productId });
    if (!product) {
      throw new Error('product not found');
    }
    product.inComingQty += qty;
    product.costPerUnit+=cost
    product.closingQty = product.openingQty + product.inComingQty - product.outGoingQty;
     this.repository.save(product);
   return {
    status:true,
    message:'product saled successfuly'
   }
  }

  async newOutGoing(productId: number, qty: number, price: number) {
    const product = await this.repository.findOneBy({ productId });
    if (!product) {
      throw new Error('product not found');
    }
    if(product.closingQty<qty) throw new NotFoundException('Not enough stock')
      product.outGoingQty+=qty
      product.sellingPricePerUnit+=price
      product.closingQty=product.openingQty+product.inComingQty-product.outGoingQty
  return  this.repository.save(product);
     
  }
  async getInventorySummary(
                page:number,
                limit:number,
                startDate?:string,
                endDate?:string,
                sortBy?:string
                  ) { 

               let totalExpenditue = 0;
               let totalRevenue = 0;
               let totalProfit = 0;
              const query = this.repository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.unitConversion', 'unitConversion');
              
                   if(startDate && endDate){
                      query.where('product.createdAt BETWEEN:startDate AND :endDate',{
                        startDate,
                        endDate
                    })
                 }
             
              query.skip((page-1) * limit).take(limit)
              const products=await query.getMany()
              const totalCount=await query.getCount()

              const processedProducts=products.map((product)=>{
                   const conversionRate=product.unitConversion?.conversionRate||1
                   const containerUnit=product.unitConversion?.containerUnit || product.baseUnit
                   const expediture=product.inComingQty * product.costPerUnit
                   const revenue=product.outGoingQty * product.sellingPricePerUnit
                   const profit=expediture-revenue

                    totalExpenditue+=expediture,
                    totalRevenue+=revenue,
                    totalProfit+=profit
                    return {
                      ...product ,
                      profit,
                      baseUnit:product.baseUnit,
                      containerUnit:containerUnit,
                      conversionUnit:conversionRate,
                      outGoingQtyPerContainer:product.outGoingQty/conversionRate
                    }
              })
              if(sortBy==="highestProfit"){
                processedProducts.sort((a,b)=>b.profit-a.profit)
              }
              else if(sortBy==='mostSold'){
                processedProducts.sort((a,b)=>b.outGoingQty-a.outGoingQty)
              }
         
       return {
         processedProducts,
         totalExpenditue: totalExpenditue,
         totalRevenue: totalRevenue,
         profit: totalProfit,
         currentPage:page,
         totalPages:Math.ceil(totalCount/limit),
         totalItems:totalCount
         
       };
  }

  async updateProduct(productid: number, updatedData: Partial<Products>) {
    const result = await this.repository.update(productid, updatedData);
    if (result.affected === 0) {
      throw new NotFoundException('Prouct not found');
    }
    return result;
  }
  async getOneProduct(productId: number) {
    return this.repository.findOneBy({ productId });
  }

  async removeProduct(productId: number): Promise<void> {
    await this.repository.delete({ productId });
  }
}

