import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.paymentsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.paymentsService.findById(+id);
  }

  @Post()
  async create(@Body() body: { order_id: number; payment_method: string; payment_status?: string; amount: number }) {
    return this.paymentsService.createPayment(body.order_id, body.payment_method, body.payment_status || 'PENDING', body.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.paymentsService.updatePayment(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentsService.deletePayment(+id);
  }
}