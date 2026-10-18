import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    MenuItemsModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
  ],
})
export class AppModule {}