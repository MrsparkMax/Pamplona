import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class MenuItemsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createMenuItem(category_id: number, item_name: string, description: string, price: number, is_available: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO menu_items (category_id, item_name, description, price, is_available) VALUES (?, ?, ?, ?, ?)',
      [category_id, item_name, description, price, is_available]
    );
    return { item_id: result.insertId, category_id, item_name, description, price, is_available };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM menu_items WHERE item_id = ?',
      [id]
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM menu_items'
    );
    return rows;
  }

  async updateMenuItem(id: number, partial: { category_id?: number; item_name?: string; description?: string; price?: number; is_available?: number }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(partial.category_id);
    }
    if (partial.item_name) {
      fields.push('item_name = ?');
      values.push(partial.item_name);
    }
    if (partial.description !== undefined) {
      fields.push('description = ?');
      values.push(partial.description);
    }
    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }
    if (partial.is_available !== undefined) {
      fields.push('is_available = ?');
      values.push(partial.is_available);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE menu_items SET ${fields.join(', ')} WHERE item_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteMenuItem(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM menu_items WHERE item_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}