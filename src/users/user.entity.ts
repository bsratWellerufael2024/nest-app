import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
   @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    email:string

    @Column()
     password:string

    @Column({default:'user'})
      role:string

    @Column()
      isActive:string
  }