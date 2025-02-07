import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./product.entity";
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({unique:true})
  name: string;
  @Column({ default: 'product catagory' })
  description: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}