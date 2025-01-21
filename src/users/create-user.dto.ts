import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator"


export class CreateUserDTO{
       @IsNumber()
       id:number

       @IsEmail()
       @IsString()
       email:string

       @IsString()
       @Length(6)
       password:string
       
       @IsString()
       role:string

       @IsString()
       isActive:string
}