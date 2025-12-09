import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
  })
  amount: number;
}
