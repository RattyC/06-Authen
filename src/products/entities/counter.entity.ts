// src/products/entities/counter.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CounterDocument = HydratedDocument<Counter>;

@Schema()
export class Counter {
    @Prop({ required: true })
  name: string; // ชื่อของตัวนับ เช่น 'product_id'

    @Prop({ default: 0 })
  seq: number;  // เลขปัจจุบัน เช่น 1, 2, 3
}

export const CounterSchema = SchemaFactory.createForClass(Counter);