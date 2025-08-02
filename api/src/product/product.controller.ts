import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { v4 as uuid } from "uuid";
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
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: join(__dirname, "../../uploads"),
        filename: (req, file, callback) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpeg|jpg|png)$/)) {
          return callback(new BadRequestException("invalid image type."), false);
        }
        callback(null, true);
      },
    }),
  )
  async create(@Body() body: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    return await this.productService.create(body, file?.filename);
  }

  @Patch(":code")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: join(__dirname, "../../uploads"),
        filename: (req, file, callback) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpeg|jpg|png)$/)) {
          return callback(new BadRequestException("invalid image type."), false);
        }
        callback(null, true);
      },
    }),
  )
  async update(@Param("code") code: string, @Body() body: UpdateProductDto, @UploadedFile() file?: Express.Multer.File) {
    return await this.productService.update(code, body, file?.filename);
  }

  @Delete(":code")
  async remove(@Param("code") code: string) {
    return await this.productService.remove(code);
  }
}
