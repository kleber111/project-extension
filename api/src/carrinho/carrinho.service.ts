import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ItemCarrinho {
  code: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable()
export class CarrinhoService {
  private items: ItemCarrinho[] = [];

  constructor(private readonly prisma: PrismaService) {}

  // Função que adiciona item ao carrinho com dados do banco
  async adicionarItem(code: string, quantity: number): Promise<void> {
    const produto = await this.prisma.produto.findUnique({
      where: { codigo: code },
    });

    if (!produto) {
      throw new Error('Produto não encontrado no banco de dados.');
    }

    const existente = this.items.find(i => i.code === code);
    if (existente) {
      existente.quantity += quantity;
    } else {
      this.items.push({
        code: produto.codigo,
        name: produto.nome,
        price: produto.preco,
        quantity: quantity,
      });
    }
  }

  removerItem(code: string): void {
    this.items = this.items.filter(i => i.code !== code);
  }

  atualizarQuantidade(code: string, quantity: number): void {
    const item = this.items.find(i => i.code === code);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removerItem(code);
      }
    }
  }

  limparCarrinho(): void {
    this.items = [];
  }

  obterItens(): ItemCarrinho[] {
    return [...this.items];
  }

  obterTotal(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
