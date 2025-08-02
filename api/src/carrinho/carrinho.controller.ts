import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';

interface AdicionarItemDTO {
  code: string;
  quantity: number;
}

interface AtualizarQuantidadeDTO {
  quantity: number;
}

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get()
  obterCarrinho() {
    return this.carrinhoService.obterItens();
  }

  @Post()
  async adicionarItem(@Body() body: { code: string; quantity: number }) {
  await this.carrinhoService.adicionarItem(body.code, body.quantity);
    return this.carrinhoService.obterItens();
  }


  @Put(':code')
  atualizarQuantidade(@Param('code') code: string, @Body() body: AtualizarQuantidadeDTO) {
    this.carrinhoService.atualizarQuantidade(code, body.quantity);
    return this.carrinhoService.obterItens();
  }

  @Delete(':code')
  removerItem(@Param('code') code: string) {
    this.carrinhoService.removerItem(code);
    return this.carrinhoService.obterItens();
  }

  @Get('total')
  obterTotal() {
    return { total: this.carrinhoService.obterTotal() };
  }

  @Delete()
  limparCarrinho() {
    this.carrinhoService.limparCarrinho();
    return { mensagem: 'Carrinho limpo com sucesso.' };
  }
}
