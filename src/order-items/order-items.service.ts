import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrderItemsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrderItem(order_id: number, item_id: number, quantity: number, unit_price: number, special_instructions?: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO order_items (order_id, item_id, quantity, unit_price, special_instructions) VALUES (?, ?, ?, ?, ?)',
      [order_id, item_id, quantity, unit_price, special_instructions ?? null]
    );
    return { order_item_id: result.insertId, order_id, item_id, quantity, unit_price, special_instructions };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM order_items WHERE order_item_id = ?',
      [id]
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM order_items'
    );
    return rows;
  }

  async updateOrderItem(id: number, partial: { quantity?: number; unit_price?: number; special_instructions?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(partial.quantity);
    }
    if (partial.unit_price !== undefined) {
      fields.push('unit_price = ?');
      values.push(partial.unit_price);
    }
    if (partial.special_instructions !== undefined) {
      fields.push('special_instructions = ?');
      values.push(partial.special_instructions);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE order_items SET ${fields.join(', ')} WHERE order_item_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteOrderItem(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM order_items WHERE order_item_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}