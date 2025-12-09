import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column({
    type: 'date',
  })
  date: string;

  @Column({
    type: 'decimal',
  })
  amount: number;
}
