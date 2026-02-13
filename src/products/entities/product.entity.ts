// src/products/entities/product.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {

    @Prop({ unique: true }) 
    id: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop()
    description: string;

    @Prop({ type: [String], default: [] })
    colors: string[];

    @Prop() // เก็บเป็น String (Path ของไฟล์) เช่น 'uploads/xxx-xxx.jpg'
    imageUrl: string;

    @Prop() 
    image: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product);