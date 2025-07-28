import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { ProductService } from "./product.service";

@Controller("")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(":code")
  async findOne(@Param("code") code: string) {
    return await this.productService.findOne(code);
  }

  @Post()
  async create(@Body() body: CreateProductDto) {
    return await this.productService.create(body);
  }

  @Patch(":code")
  async update(@Param("code") code: string, @Body() body: UpdateProductDto) {
    return await this.productService.update(code, body);
  }

  @Delete(":code")
  async remove(@Param("code") code: string) {
    return await this.productService.remove(code);
  }
}
