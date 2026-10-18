import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(customer_id: number, restaurant_id: number, driver_id: number, delivery_address_id: number, order_status: string, total_amount: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (customer_id, restaurant_id, driver_id, delivery_address_id, order_status, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [customer_id, restaurant_id, driver_id, delivery_address_id, order_status, total_amount]
    );
    return { order_id: result.insertId, customer_id, restaurant_id, driver_id, delivery_address_id, order_status, total_amount };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM orders WHERE order_id = ?',
      [id]
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM orders'
    );
    return rows;
  }

  async updateOrder(id: number, partial: { order_status?: string; total_amount?: number; driver_id?: number }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_status) {
      fields.push('order_status = ?');
      values.push(partial.order_status);
    }
    if (partial.total_amount !== undefined) {
      fields.push('total_amount = ?');
      values.push(partial.total_amount);
    }
    if (partial.driver_id !== undefined) {
      fields.push('driver_id = ?');
      values.push(partial.driver_id);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteOrder(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}