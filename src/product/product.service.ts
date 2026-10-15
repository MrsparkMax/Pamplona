import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createProduct(product_name: string, price: number, user_id?: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO products (product_name, price, user_id) VALUES (?, ?, ?)',
      [product_name, price, user_id || null]
    );

    return { id: result.insertId, product_name, price, user_id };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM products WHERE product_id = ?',
      [id]
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM products'
    );
    return rows;
  }

  async updateProduct(id: number, partial: { product_name?: string; price?: number; user_id?: number }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.product_name) {
      fields.push('product_name = ?');
      values.push(partial.product_name);
    }

    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }

    if (partial.user_id !== undefined) {
      fields.push('user_id = ?');
      values.push(partial.user_id);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteProduct(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM products WHERE product_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}