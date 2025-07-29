import { Injectable, NotFoundException } from "@nestjs/common";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const products = await this.prisma.product.findMany();

    return products.map((product) => ({
      ...product,
      imageUrl: product.image ? `${process.env.BASE_URL}${product.image}` : null,
    }));
  }

  async findOne(code: string) {
    const product = await this.prisma.product.findUnique({ where: { code: code } });
    if (!product) {
      throw new NotFoundException("Product not found.");
    }
    return { ...product, imageUrl: product.image ? `${process.env.BASE_URL}${product.image}` : null };
  }

  async create(data: CreateProductDto, file?: string) {
    const product = await this.prisma.product.findUnique({ where: { code: data.code } });

    if (product) {
      if (file) {
        const path = join(__dirname, "../../uploads", file);
        if (existsSync(path)) {
          unlinkSync(path);
        }
      }
      const newQuantity = await this.alterQuantity(product.code, "increase");
      return await this.prisma.product.update({ where: { code: product.code }, data: { quantity: newQuantity } });
    }

    return await this.prisma.product.create({ data: { ...data, quantity: 1, image: file } });
  }

  async update(code: string, data: UpdateProductDto, file?: string) {
    const product = await this.findOne(code);

    if (product.image) {
      const path = join(__dirname, "../../uploads", product.image);
      if (existsSync(path)) {
        unlinkSync(path);
      }
    }

    return await this.prisma.product.update({ where: { code: product.code }, data: { ...data, image: file } });
  }

  async remove(code: string) {
    const product = await this.findOne(code);
    const newQuantity = await this.alterQuantity(code, "decrement");

    if (newQuantity <= 0) {
      if (product.image) {
        const path = join(__dirname, "../../uploads", product.image);
        if (existsSync(path)) {
          unlinkSync(path);
        }
      }
      return await this.prisma.product.delete({ where: { code: product.code } });
    }

    return await this.prisma.product.update({ where: { code: code }, data: { quantity: newQuantity } });
  }

  private async alterQuantity(code: string, operation: string, quantity: number = 1) {
    const product = await this.findOne(code);

    if (operation === "increase") {
      return product.quantity + quantity;
    }
    if (operation === "decrement") {
      return product.quantity - quantity;
    }
    throw new Error("Invalid operation type.");
  }
}
