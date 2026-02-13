import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    IsOptional,
    IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer'; 

export class CreateProductDto {
    @IsNotEmpty()    
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number) 
    price: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (typeof value === 'string') return [value];
        return value;
    })
    colors?: string[];

    @IsOptional()
    @IsString()
    image?: string;
}