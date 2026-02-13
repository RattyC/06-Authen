// src/products/products.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseArrayPipe,UseInterceptors, UploadedFile, ParseFilePipe,
MaxFileSizeValidator } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { PRODUCT_IMAGE } from './products.constants';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // ชื่อฟิลด์ที่รับไฟล์จาก form-data “image”
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: PRODUCT_IMAGE.MAX_SIZE })
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    console.log('---------------------------');
    console.log('1. ข้อมูลที่ส่งมา (DTO):', dto);
    console.log('2. ไฟล์ที่ได้รับ (File):', file);
    console.log('---------------------------');
    return this.productsService.create(dto, file);
  }


  @Post('bulk')
  createMany(
    @Body(new ParseArrayPipe({ items: CreateProductDto }))
    createProductDtos: CreateProductDto[],
  ) {
    return this.productsService.createMany(createProductDtos);
  }

  @Get()
  findAll(
    @Query('keyword') keyword?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort?: string,
    @Query('color') color?: string, 
  ) {
    // แปลงค่าตัวเลข และป้องกัน NaN (
    const min = (minPrice && !isNaN(parseFloat(minPrice))) ? parseFloat(minPrice) : undefined;
    const max = (maxPrice && !isNaN(parseFloat(maxPrice))) ? parseFloat(maxPrice) : undefined;
    return this.productsService.findAll(keyword, min, max, sort, color);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image')) 
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, //  ต้องเป็น false เพราะการแก้ไขอาจจะไม่เปลี่ยนรูปก็ได้
        validators: [
          new MaxFileSizeValidator({ maxSize: PRODUCT_IMAGE.MAX_SIZE })
        ],
      }),
    )
    file?: Express.Multer.File, 
  ) {
    return this.productsService.update(id, updateProductDto, file); 
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}