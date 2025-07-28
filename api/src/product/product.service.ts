import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(code: string) {
    const product = await this.prisma.product.findUnique({ where: { code: code } });
    if (!product) {
      throw new NotFoundException("Product not found.");
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { code: data.code } });

    if (product) {
      const newQuantity = await this.alterQuantity(product.code, "increase");
      return await this.prisma.product.update({
        where: { code: product.code },
        data: { quantity: newQuantity },
      });
    }

    return await this.prisma.product.create({ data: { ...data, quantity: 1 } });
  }

  async update(code: string, data: UpdateProductDto) {
    const product = await this.findOne(code);
    return await this.prisma.product.update({ where: { code: product.code }, data: data });
  }

  async remove(code: string) {
    const product = await this.findOne(code);
    const newQuantity = await this.alterQuantity(code, "decrement");

    if (newQuantity <= 0) {
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
