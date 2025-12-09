import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoices')
@Index('idx_invoices_metadata', { synchronize: false })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
  })
  amount: number;

  @Column('jsonb', { default: {} })
  metadata: Record<string, string>;
}
