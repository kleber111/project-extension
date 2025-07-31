import { Module } from '@nestjs/common';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
  exports: [CarrinhoService],
  imports:[PrismaModule],
  
})
export class CarrinhoModule {}
