import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAll() {
    return this.restaurantsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.restaurantsService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { owner_id: number; name: string; phone?: string; is_open?: number }) {
    return this.restaurantsService.createRestaurant(body.owner_id, body.name, body.phone, body.is_open);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.restaurantsService.updateRestaurant(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantsService.deleteRestaurant(+id);
  }
}