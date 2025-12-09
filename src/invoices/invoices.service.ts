import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { FindInvoicesQueryDto } from './dto/find-invoices-query.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async create(data: CreateInvoiceDto) {
    return this.invoiceRepository.save(data);
  }

  async findAll(query: FindInvoicesQueryDto) {
    const queryBuilder = this.invoiceRepository.createQueryBuilder('i');

    if (query.metadata) {
      let index = 0;
      for (const [key, value] of Object.entries(query.metadata)) {
        queryBuilder.andWhere(`i.metadata ->> :key${index} = :value${index}`, {
          [`key${index}`]: key,
          [`value${index}`]: value,
        });
        index++;
      }
    }

    return queryBuilder.getMany();
  }

  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOneBy({ id });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    const metadata = { ...(invoice.metadata ?? {}) };

    if (data.metadata) {
      for (const [key, value] of Object.entries(data.metadata)) {
        if (value === '') {
          // if key is provided, but has an empty value, remove it from metadata
          delete metadata[key];
        } else {
          metadata[key] = value;
        }
      }
    }

    return this.invoiceRepository.save({
      ...invoice,
      ...data,
      metadata: metadata,
    });
  }
}
