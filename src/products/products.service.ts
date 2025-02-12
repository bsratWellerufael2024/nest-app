import { HttpException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './product.entity';
import { UnitCoversion } from 'src/unitconversion/unit.entity';
import { Category } from './category.entity';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { ProductTransaction } from './product.transaction.entity';
import { group } from 'console';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private repository: Repository<Products>,

    @InjectRepository(UnitCoversion)
    private UnitConversion: Repository<UnitCoversion>,

    @InjectRepository(Category)
     private categoryRepository:Repository<Category>,
    @InjectRepository(ProductTransaction)
     private productTrasactionRepo:Repository<ProductTransaction>
  ) {}

async createProduct( 
   productName: string,
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

  async newIncoming(productId: number,qty:number,unit_cost:number,user:any):Promise<ApiResponse<any>> {
      
    try{
         const transaction=this.productTrasactionRepo.create({
           product:{productId},
           type:'purchase', 
           quantity:qty,
           unit_cost:unit_cost,
           total_cost:unit_cost *qty,
           remaining_quantity:qty,
           user_email:user.email,
           date:new Date()
         })
         this.productTrasactionRepo.save(transaction)
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
               const transactions = await this.productTrasactionRepo.find({
               where: { product: { productId }, type: 'purchase' },
               order: { date: 'ASC' },
             });
             let remainingqtyToSell = qty;
             let totalCOGS = 0;
             for (const transaction of transactions) {
               if (transaction.remaining_quantity > 0) {
                 const qtyToDeduct = Math.min(
                   transaction.remaining_quantity,
                   remainingqtyToSell,
                 );
                 totalCOGS += transaction.unit_cost * qtyToDeduct;
                 transaction.remaining_quantity -= qtyToDeduct;
                 console.log(totalCOGS);
                 remainingqtyToSell -= qtyToDeduct;
                 await this.productTrasactionRepo.save(transactions);
                 if (remainingqtyToSell === 0) break;
               }
             }
             if (remainingqtyToSell > 0) {
               throw new Error('Not enough stock available');
             }
             const saleTransaction = this.productTrasactionRepo.create({
               product: { productId },
               type: 'sale',
               quantity: qty,
               unit_price: price,
               total_price: qty * price,
               total_cost: totalCOGS,
               date: new Date(),
             });
             await this.productTrasactionRepo.save(saleTransaction);
             return new ApiResponse(
               true,
               `Product outGoing successfuly`,
             );
    }
    catch(error){
        throw new HttpException(new ApiResponse(false,'Error selling product',undefined,{code:500,detail:error.message}),
        HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async getInventorySummary(page:number,limit:number,startDate?:string,endDate?:string,sortBy?:string ) {
   
           const query = this.repository
             .createQueryBuilder('product')
             .leftJoinAndSelect('product.unitConversion', 'unitConversion')
             .leftJoinAndSelect('product.category','category')
             .leftJoinAndSelect('product.transactions','transactions')
            if(startDate && endDate){
              query.where('product.createdAt BETWEEN:startDate AND :endDate',{startDate,endDate})
             }
          query.skip((page-1) * limit).take(limit)
          const products=await query.getMany()
          const totalCount=await query.getCount()
          const groupedProducts={}
               products.forEach((product)=>{
                const conversionRate= product.unitConversion?.conversionRate||1
                const containerUnit=product.unitConversion?.containerUnit||product.baseUnit
                  const categoryName=product.category.name
                  if(!groupedProducts[categoryName]){
                          groupedProducts[categoryName]={
                          group:categoryName,
                          subTotalOpeningQty:0,
                          subTotalIncomingQty:0,
                          subTotalOutGoingQty:0 ,
                          subTotalClosingQty:0,
                          products:[]
                         }     
                   }
                 groupedProducts[categoryName].subTotalOpeningQty+=product.openingQty
                 const purchasedQty=product.transactions.filter(t=>t.type==='purchase')
                 const soldQty=product.transactions.filter(t=>t.type==='sale')
                 const subTotalIncomingQty=purchasedQty.reduce((sum,tx)=>sum+(tx.quantity)||0,0)
                 const subTotalOutGoingQty=soldQty.reduce((sum,tx)=>sum+(tx.quantity)||0,0)
                groupedProducts[categoryName].subTotalIncomingQty+=subTotalIncomingQty  
                groupedProducts[categoryName].subTotalOutGoingQty+=subTotalOutGoingQty     
                groupedProducts[categoryName].subTotalClosingQty =
                  groupedProducts[categoryName].subTotalClosingQty =
                    groupedProducts[categoryName].subTotalOpeningQty +
                    groupedProducts[categoryName].subTotalIncomingQty -
                    groupedProducts[categoryName].subTotalOutGoingQty;
                const productsList = {
                  productName: product.productName,
                  baseUnit: product.baseUnit,
                  openingQty: product.openingQty,
                  openingQtyPerContainer: `${Math.round((product.openingQty/conversionRate)*10)/10} ${containerUnit}`,
                };

                groupedProducts[categoryName].products.push(productsList)
              
          })
          const groupedProductsArray=Object.values(groupedProducts)
           return new ApiResponse(true,'Data Fetched Successfuly',groupedProductsArray)
    
  }

  async updateProduct(productid: number, updatedData: Partial<Products>) {
    const result = await this.repository.update(productid, updatedData);
    if (result.affected === 0) {
      throw new NotFoundException('Prouct not found');
    }
    return result;
  }

  async productDetail(productId: number):Promise<ApiResponse<any>> {
   try{
           const transactions = await this.productTrasactionRepo.find({
           where: { product: {productId:productId} },
           order:{date:'DESC'},
           select:['quantity','type','unit_cost','total_cost','unit_price','total_price','remaining_quantity','date','user_email']
         });
         const product=await this.repository.findOneBy({productId})
         const products=await this.repository.find({where:{productId:productId}})
         console.log(products);
         const openingQty=product.openingQty;
         const purchaseTransaction=transactions.filter(tx=>tx.type==='purchase')
         const sellTransaction=transactions.filter(tx=>tx.type=='sale')
         const incomingQty=purchaseTransaction.reduce((sum,tx)=>sum+(tx.quantity ||0),0)
         const outGoingQty=sellTransaction.reduce((sum,tx)=>sum+(tx.quantity ||0),0)
         const closingQty=openingQty+incomingQty-outGoingQty
       
         console.log(incomingQty,outGoingQty,closingQty);
         return new ApiResponse(true, 'Product Detail Succssfuly Fetched', {
           incomingQty,
           outGoingQty,
           closingQty,
           productDetail: products.map((product) => ({
             productName: product.productName,
             unit: product.baseUnit,
             specfication: product.specification,
             containerUnit: product.unitConversion.containerUnit,
             rate: product.unitConversion.conversionRate,
             incomingQtyPerCarton: `${Math.round((incomingQty / product.unitConversion.conversionRate) * 10) / 10} ${product.unitConversion.containerUnit}`,
             outGoingQtyPerCarton: `${Math.round((outGoingQty / product.unitConversion.conversionRate) * 10) / 10} ${product.unitConversion.containerUnit}`,
             closingQtyPerCarton: `${Math.round((closingQty / product.unitConversion.conversionRate) * 10) / 10} ${product.unitConversion.containerUnit}`,
             openingQtyPerCarton: `${Math.round((openingQty / product.unitConversion.conversionRate) * 10) / 10} ${product.unitConversion.containerUnit}`,
             category: product.category.name,
             openingQty: product.openingQty,
             date: product.createdAt,
             recent_transactions:  transactions.map((t) => ({
               type: t.type,
               quantity: t.quantity,
               ...(t.type==='purchase' &&{
                purchasedBy:t.user_email
               }),
               ...(t.type==='sale' && {
                SoldBy:t.user_email
               }),
               unit_cost:t.type==='purchase'? t.unit_cost:undefined,
               total_cost: t.type === 'purchase' ? t.total_cost : undefined,
               unit_price: t.type === 'sale' ? t.unit_price : undefined,
               total_price: t.type === 'sale' ? t.total_price : undefined,
               remaing_quantity:t.type==='purchase'?t.remaining_quantity:undefined,
               date: t.date? new Date(t.date).toISOString().split('T')[0]:null
             })),
           })),
         });
   }
   catch(error){
        throw new HttpException(new ApiResponse(false,'Error Fetching Data',undefined,{code:500,detail:error.message}),
        HttpStatus.INTERNAL_SERVER_ERROR
      )
   }
    
  }

 async addCatagory(id:number,name:string,description?:string){
     const newCatagory= await this.categoryRepository.create({id,name,description})
          return this.categoryRepository.save(newCatagory)
 }

async getCatagory(){
    return await this.categoryRepository.find()   
}
  async removeProduct(productId: number): Promise<void> {
    await this.repository.delete({ productId });
  }
}

