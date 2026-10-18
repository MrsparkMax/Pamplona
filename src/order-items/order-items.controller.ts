import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order-items')
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.orderItemsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.orderItemsService.findById(+id);
  }

  @Post()
  async create(@Body() body: { order_id: number; item_id: number; quantity: number; unit_price: number; special_instructions?: string | null }) {
    return this.orderItemsService.createOrderItem(
      body.order_id,
      body.item_id,
      body.quantity,
      body.unit_price,
      body.special_instructions ?? undefined
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.orderItemsService.updateOrderItem(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderItemsService.deleteOrderItem(+id);
  }
}