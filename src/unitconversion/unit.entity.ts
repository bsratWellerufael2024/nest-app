import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('units') 
export class UnitCoversion{
 @PrimaryGeneratedColumn()
     id:number

  @Column()
  baseUnit:string

  @Column()
  containerUnit:string

  @Column('float',{default:1})
  conversionRate:number

  @Column({default:false})

   isUserDefined:boolean
}

