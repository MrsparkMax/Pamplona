import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private menuItemsService: MenuItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.menuItemsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.menuItemsService.findById(+id);
  }

  @Post()
  async create(@Body() body: { category_id: number; item_name: string; description?: string | null; price: number; is_available?: number }) {
    return this.menuItemsService.createMenuItem(
      body.category_id,
      body.item_name,
      body.description ?? '',
      body.price,
      body.is_available !== undefined ? body.is_available : 1
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.menuItemsService.updateMenuItem(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.menuItemsService.deleteMenuItem(+id);
  }
}