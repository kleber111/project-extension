import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";

@Module({
  imports: [ProductModule, PrismaModule],
})
export class AppModule {}
