import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.ordersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.ordersService.findById(+id);
  }

  @Post()
  async create(@Body() body: { customer_id: number; restaurant_id: number; driver_id?: number; delivery_address_id?: number; order_status?: string; total_amount: number }) {
    return this.ordersService.createOrder(
      body.customer_id,
      body.restaurant_id,
      (body.driver_id || null) as number,
      (body.delivery_address_id || null) as number,
      body.order_status || 'PENDING',
      body.total_amount
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.ordersService.updateOrder(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.deleteOrder(+id);
  }
}