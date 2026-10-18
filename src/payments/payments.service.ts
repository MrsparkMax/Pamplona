import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PaymentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPayment(order_id: number, payment_method: string, payment_status: string, amount: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO payments (order_id, payment_method, payment_status, amount) VALUES (?, ?, ?, ?)',
      [order_id, payment_method, payment_status, amount]
    );
    return { payment_id: result.insertId, order_id, payment_method, payment_status, amount };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM payments WHERE payment_id = ?',
      [id]
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM payments'
    );
    return rows;
  }

  async updatePayment(id: number, partial: { payment_method?: string; payment_status?: string; amount?: number }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.payment_method) {
      fields.push('payment_method = ?');
      values.push(partial.payment_method);
    }
    if (partial.payment_status) {
      fields.push('payment_status = ?');
      values.push(partial.payment_status);
    }
    if (partial.amount !== undefined) {
      fields.push('amount = ?');
      values.push(partial.amount);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE payments SET ${fields.join(', ')} WHERE payment_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deletePayment(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM payments WHERE payment_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}