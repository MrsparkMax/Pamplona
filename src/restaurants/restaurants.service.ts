import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class RestaurantsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createRestaurant(owner_id: number, name: string, phone?: string, is_open = 1) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO restaurants (owner_id, name, phone, is_open) VALUES (?, ?, ?, ?)',
      [owner_id, name, phone || null, is_open]
    );
    return { restaurant_id: result.insertId, owner_id, name, phone, is_open };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM restaurants WHERE restaurant_id = ?',
      [id]
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM restaurants'
    );
    return rows;
  }

  async updateRestaurant(id: number, partial: { name?: string; phone?: string; is_open?: number }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.name) {
      fields.push('name = ?');
      values.push(partial.name);
    }
    if (partial.phone !== undefined) {
      fields.push('phone = ?');
      values.push(partial.phone);
    }
    if (partial.is_open !== undefined) {
      fields.push('is_open = ?');
      values.push(partial.is_open);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE restaurants SET ${fields.join(', ')} WHERE restaurant_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteRestaurant(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM restaurants WHERE restaurant_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}