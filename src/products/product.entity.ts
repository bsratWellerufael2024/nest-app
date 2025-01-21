import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Products{
    @PrimaryGeneratedColumn()
    productId:number

    @Column()
    productName:string

    @Column()
     price:number
}