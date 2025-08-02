import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";
import { CarrinhoModule } from "./carrinho/carrinho.module";

@Module({
  imports: [ProductModule, PrismaModule, CarrinhoModule],
})
export class AppModule {}

