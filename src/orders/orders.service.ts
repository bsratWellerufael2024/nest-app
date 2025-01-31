import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  orders = [
    {
      id: 1,
      productName: 'orange',
      price: '$10',
      stocked:false
    },
    {
      id: 2,
      productName: 'banana',
      price: '$20',
      stocked:true
    },
    {
      id: 3,
      productName: 'apple',
      price: '$30',
      stocked:true
    },
  ];

  findOne(id:number){
       return  this.orders.find(order=>order.id===id)
  }
  filteredProducts(isStocked:boolean){
      return this.orders.filter(inStock=>inStock.stocked===isStocked)
  }
  
}
