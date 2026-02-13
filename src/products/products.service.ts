// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Counter } from './entities/counter.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}

  // --- ฟังก์ชันสำหรับขอเลข ID ถัดไป (Auto Increment) ---
  private async getNextSequenceValue(sequenceName: string): Promise<number> {
    const sequenceDocument = await this.counterModel.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return sequenceDocument.seq;
  }

  // --- สร้างสินค้า (Create) ---
  async create(
    createProductDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const nextId = await this.getNextSequenceValue('product_id');

    if (file) {
      createProductDto.image = file.filename;
    }

    const createdProduct = new this.productModel({
      ...createProductDto,
      id: nextId,
    });

    return createdProduct.save();
  }

  // --- สร้างหลายรายการ (Create Many) ---
  async createMany(createProductDtos: CreateProductDto[]): Promise<Product[]> {
    const productsWithIds: any[] = [];

    for (const dto of createProductDtos) {
      const nextId = await this.getNextSequenceValue('product_id');
      productsWithIds.push({ ...dto, id: nextId });
    }

    return this.productModel.insertMany(productsWithIds) as any;
  }

  async findAll(
    keyword?: string,
    minPrice?: number,
    maxPrice?: number,
    sort?: string,
    color?: string,
  ): Promise<Product[]> {
    const filter: any = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (color) {
      filter.colors = color;
    }

    let query = this.productModel.find(filter);

    if (sort) {
      const sortOrder = sort === 'desc' ? -1 : 1;
      query = query.sort({ price: sortOrder });
    }

    return query.exec();
  }

  // --- ดึงข้อมูลรายตัว (Read One) ---
  async findOne(id: string): Promise<Product> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(
        `Invalid ID format: "${id}" must be a number`,
      );
    }

    const product = await this.productModel.findOne({ id: numericId }).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // --- แก้ไขข้อมูล (Update) ---
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(
        `Invalid ID format: "${id}" must be a number`,
      );
    }

    if (file) {
      updateProductDto.image = file.filename;
    }

    const updatedProduct = await this.productModel
      .findOneAndUpdate({ id: numericId }, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  // --- ลบข้อมูล (Delete) ---
  async remove(id: string): Promise<Product> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(
        `Invalid ID format: "${id}" must be a number`,
      );
    }

    const deletedProduct = await this.productModel
      .findOneAndDelete({ id: numericId })
      .exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }
}
