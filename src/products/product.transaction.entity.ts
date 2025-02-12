import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./product.entity";

@Entity()
export class ProductTransaction{
    @PrimaryGeneratedColumn()
      transaction_id:number
    @ManyToOne(()=>Products,(product)=>product.transactions,{onDelete:"CASCADE"})
      product:Products
    @Column({type:"enum",enum:['purchase','sale']})
      type:'purchase'|'sale'
    @Column()
      quantity:number
    @Column({nullable:true})
      unit_cost?:number
    @Column({nullable:true})
      total_cost?:number
    @Column({nullable:true})
      unit_price?:number
    @Column({nullable:true})
      total_price?:number
    @Column({nullable:true})
     user_email:string
    @Column({type:'date'})
      date:Date
    @Column({nullable:true})
    remaining_quantity:number
}