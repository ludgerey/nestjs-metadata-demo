import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FindInvoicesQueryDto } from './dto/find-invoices-query.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiCreatedResponse({ type: InvoiceDto })
  @Post()
  create(@Body() data: CreateInvoiceDto): Promise<InvoiceDto> {
    return this.invoicesService.create(data);
  }

  @ApiOkResponse({ type: [InvoiceDto] })
  @Get()
  findAll(@Query() query: FindInvoicesQueryDto): Promise<InvoiceDto[]> {
    return this.invoicesService.findAll(query);
  }
}
