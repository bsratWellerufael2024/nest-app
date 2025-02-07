import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './product.entity';
import { UnitCoversion } from 'src/unitconversion/unit.entity';
import { Category } from './category.entity';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { CatagoryDto } from './category.dto';
import { ProductDto } from './product.dto';
import { group } from 'console';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private repository: Repository<Products>,

    @InjectRepository(UnitCoversion)
    private UnitConversion: Repository<UnitCoversion>,

    @InjectRepository(Category)
     private categoryRepository:Repository<Category>
  ) {}

async createProduct( 
  productName: string,
   costPerUnit: number,
   specification: string,
   baseUnit: string,
   categoryId:number,
   openingQty: number,): Promise<ApiResponse<any>>
    {
    try{
          const category = await this.categoryRepository.findOne({ where: { id: categoryId }});
           if(!category){
             throw new NotFoundException(`Product With Catagory ${categoryId} Not Found`)
           }
          const newProduct = await this.repository.create({ 
            productName, 
            costPerUnit,
            specification,
            baseUnit,
            category,openingQty,
          });

          await this.repository.save(newProduct);
          return new ApiResponse(true,`Product ${productName} Added Successfuly`)
    }
    catch(error){
          throw new HttpException(new ApiResponse(
             false,
            `Error Product${productName} Can't Added`,
            undefined,
            {code:500,detail:error.message}),
            HttpStatus.INTERNAL_SERVER_ERROR
          )
    }

}

  async newIncoming(productId: number,qty:number,cost:number,productDto?:ProductDto):Promise<ApiResponse<any>> {
      const {inComingQty,costPerUnit}=productDto
    try{
         const product = await this.repository.findOneBy({ productId });
         if (!product) {
           throw new NotFoundException(`Product With Id ${productId} Not Found`)
         }
         if([inComingQty,costPerUnit].some((value)=>isNaN(value))){
             throw new BadRequestException('One or more values invalid')
         }
         product.inComingQty += qty;
         product.costPerUnit += cost;
         product.closingQty = product.openingQty + product.inComingQty - product.outGoingQty;
         this.repository.save(product);
         return new ApiResponse(true, `NewIncoming Product Added Successfuly`);
     }
     catch(error){
           throw new HttpException(new ApiResponse(
              false,
             `Error New Product Can't Added `
             ,undefined,
             {code:500,detail:error.message}),
             HttpStatus.INTERNAL_SERVER_ERROR
          )
     }
  }
  async newOutGoing(productId: number, qty: number, price: number):Promise<ApiResponse<any>> {
      try{
         const product = await this.repository.findOneBy({ productId });
         if (!product) {
           throw new NotFoundException(`Product with productId ${productId}not found`)
         }
         if (product.closingQty < qty)
            throw new NotFoundException('Not enough stock');
            product.outGoingQty += qty;
            product.sellingPricePerUnit += price;
            product.closingQty = product.openingQty + product.inComingQty - product.outGoingQty;
            await this.repository.save(product);
            return new ApiResponse(true,`Product ${product.productName} outGoing successfuly`)
      }
      catch(error){
              throw new HttpException(new ApiResponse(
                  false,
                  `Error ${productId} while outGoing`,
                  undefined,
                  {code:500,detail:error.message}),
                  HttpStatus.INTERNAL_SERVER_ERROR
                )
      }
  }
  async getInventorySummary(page:number,limit:number,startDate?:string,endDate?:string,sortBy?:string ) {
   
  //   const groupedUsers={}
  //   const users = [
  //     { name: 'bsrat', category: 'user', age: 23 },
  //     { name: 'robel', category: 'admin', age: 12 },
  //     { name: 'alex', category: 'user', age: 12 },
  //   ];
    
  //  users.map((user)=>{
  //   const categoryName=user.category
  //   if(!groupedUsers[categoryName]){
  //     groupedUsers[categoryName]={
  //           role:categoryName,
  //           users:[]
  //     }
  //   }
  //  const userList={
  //       name:user.name,
  //       age:user.age
  //  }
  //   groupedUsers[categoryName].users.push(userList)
  // })
  //   try{
  //       const data=Object.values(groupedUsers)
  //        return new ApiResponse(true,"Summary Fetched Successfuly",data)
  //      }
  //   catch(error){
  //     throw new HttpException(new ApiResponse(false,"Error Feching Data",undefined,{code:500,detail:error.message}),
  //         HttpStatus.INTERNAL_SERVER_ERROR
  //   )
  //   }
            let totalExpenditue = 0;
            let totalRevenue = 0;
            let totalProfit = 0;
           const query = this.repository
             .createQueryBuilder('product')
             .leftJoinAndSelect('product.unitConversion', 'unitConversion')
             .leftJoinAndSelect('product.category','category')
          
          //   if(startDate && endDate){
          //     query.where('product.createdAt BETWEEN:startDate AND :endDate',{startDate,endDate})
          //    }

          query.skip((page-1) * limit).take(limit)
          const products=await query.getMany()
          const totalCount=await query.getCount()
          const groupedProducts={}

          const processedProducts=products.map((product)=>{
                const conversionRate= product.unitConversion?.conversionRate||1
                const containerUnit=product.unitConversion?.containerUnit||product.baseUnit
                const expediture=product.inComingQty * product.costPerUnit
                const revenue=product.outGoingQty * product.sellingPricePerUnit
                const profit=revenue-expediture
                totalExpenditue+=expediture,
                totalRevenue+=revenue,
                totalProfit+=profit

                  const categoryName=product.category.name
                   if(!groupedProducts[categoryName]){
                          groupedProducts[categoryName]={
                          group:categoryName,
                          subTotalOpeningQty:0,
                          subTotalIncomingQty:0,
                          subTotalOutGoingQty:0 ,
                          subTotalClosingQty:0,
                          subTotalCost:0,
                          subTotalPrice:0,
                          subTotalProfit:0,
                          products:[]
                         }     
                   }
                 groupedProducts[categoryName].subTotalOpeningQty+=product.openingQty
                 groupedProducts[categoryName].subTotalIncomingQty+=product.inComingQty
                 groupedProducts[categoryName].subTotalOutGoingQty+=product.outGoingQty
                 groupedProducts[categoryName].subTotalClosingQty+=product.closingQty
                 groupedProducts[categoryName].subTotalCost+=product.costPerUnit
                 groupedProducts[categoryName].subTotalPrice+product.sellingPricePerUnit
                 const productsList = {
                   productName: product.productName,
                   baseUnit: product.baseUnit,
                   openingQty: product.openingQty,
                   openingQtyPerContainer: `${Math.round((product.openingQty/conversionRate)*10)/10} ${containerUnit}`,
                   incomingQty: product.inComingQty,
                   incomingQtyPerContainer: `${product.inComingQty / conversionRate} ${containerUnit}`,
                   outGoingQty: product.outGoingQty,
                   outGoingQtyPerContainer: `${product.outGoingQty / conversionRate} ${containerUnit}`,
                   closingQty: product.closingQty,
                   closingQtyPerContainer: `${product.closingQty / conversionRate} ${containerUnit}`,
                   costPerUnit: product.costPerUnit,
                   price: product.sellingPricePerUnit,
                 };

                groupedProducts[categoryName].products.push(productsList)
                // return {
                //   inComingQtyPerContainer: `${product.inComingQty/conversionRate} ${containerUnit}`,
                //   closingQtyPerContainer: `${product.closingQty / conversionRate} ${containerUnit}`,
                //   };
          })
            // const data=Object.values(groupedProducts)
           return new ApiResponse(true,'Data Fetched Successfuly',groupedProducts)

          // if(sortBy==="highestProfit"){
          //   processedProducts.sort((a,b)=>b.profit-a.profit)
          // }
          // if(sortBy==='mostSold'){
          //   processedProducts.sort((a,b)=>b.outGoingQty-a.outGoingQty)
          // }

    // return {
      // processedProducts:processedProducts
      // totalExpenditue: totalExpenditue,
      // totalRevenue: totalRevenue,
      // profit: totalProfit,
      // currentPage:page,
      // totalPages:Math.ceil(totalCount/limit),
      // totalItems:totalCount
    // };
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

//  async addCatagory(id:number,name:string,description?:string){
//      const newCatagory= await this.categoryRepository.create({id,name,description})
//           return this.categoryRepository.save(newCatagory)
//  }

// async getCatagory(){
//       const getCatagory=await this.repository.find()
//       getCatagory.map((product)=>{
//          return {catagory:product.category.id}
//       })
// }
  async removeProduct(productId: number): Promise<void> {
    await this.repository.delete({ productId });
  }
}

