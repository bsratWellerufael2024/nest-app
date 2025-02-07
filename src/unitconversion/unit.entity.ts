import { Column, Entity, PrimaryGeneratedColumn ,OneToMany} from "typeorm";
import { Products } from "src/products/product.entity";
@Entity('units')
export class UnitCoversion {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Ensures baseUnit is unique
  baseUnit: string;

  @Column()
  containerUnit: string;

  @Column('float', { default: 1 }) // Ensures conversion rate is stored correctly
  conversionRate: number;

  @Column({ default: false })
  isUserDefined: boolean;

  @OneToMany(() => Products, (product) => product.unitConversion)
  products: Products[];
}

