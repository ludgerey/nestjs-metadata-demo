import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { FindInvoicesQueryDto } from './dto/find-invoices-query.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  create(data: CreateInvoiceDto) {
    return this.invoiceRepository.save(data);
  }

  findAll(query: FindInvoicesQueryDto) {
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
}
