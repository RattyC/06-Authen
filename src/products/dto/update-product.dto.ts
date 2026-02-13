import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    IsOptional,
    IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer'; 

export class UpdateProductDto extends PartialType(CreateProductDto) {
@IsString()
    image?: string;
}