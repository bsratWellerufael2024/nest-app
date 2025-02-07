import { UnitCoversion } from "src/unitconversion/unit.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  productName: string;

  @Column()
  specification: string;

  @Column()
  baseUnit: string;

  @ManyToOne(() => UnitCoversion, (unitConversion) => unitConversion.products, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'baseUnit', referencedColumnName: 'baseUnit' }) // Correct JoinColumn
  unitConversion: UnitCoversion;

  @Column({ default: 0 })
  openingQty: number;

  @Column({ default: 0 })
  inComingQty: number;

  @Column({ default: 0 })
  outGoingQty: number;

  @Column({ default: 0 })
  closingQty: number; 
   
  @Column()
   categoryId:number

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({name:"categoryId"}) // This correctly establishes the foreign key
  category: Category;

  @Column('float', { default: 0 })
  costPerUnit: number;

  @Column('float', { default: 0 })
  sellingPricePerUnit: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}