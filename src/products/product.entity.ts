import { UnitCoversion } from "src/unitconversion/unit.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(()=>UnitCoversion,{nullable:true})
  @JoinColumn()
  unitConversion:UnitCoversion

  @Column({ default: 0 })
  openingQty: number;

  @Column({ default: 0 })
  inComingQty: number;

  @Column({ default: 0 })
  outGoingQty: number;

  @Column({default:0})
  closingQty:number
  
  @Column()
  catagory: string;
 
  @Column('float',{default:0})
  costPerUnit:number

  @Column('float',{default:0})
  sellingPricePerUnit:number

  @CreateDateColumn({type:'timestamp'})
   createdAt:Date
}