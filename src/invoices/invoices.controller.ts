import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FindInvoicesQueryDto } from './dto/find-invoices-query.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() data: CreateInvoiceDto) {
    return this.invoicesService.create(data);
  }

  @Get()
  findAll(@Query() query: FindInvoicesQueryDto) {
    return this.invoicesService.findAll(query);
  }
}
