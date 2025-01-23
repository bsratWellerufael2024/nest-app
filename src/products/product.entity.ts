import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Products{
    @PrimaryGeneratedColumn()
    productId:number

    @Column()
    productName:string

    @Column()
    specification:string

    @Column()
     unit:string
     

     @Column()
     qty:number

     @Column()
     catagory:string
     
    @Column()
     price:number
}