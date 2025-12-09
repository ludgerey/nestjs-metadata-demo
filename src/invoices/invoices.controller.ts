import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FindInvoicesQueryDto } from './dto/find-invoices-query.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

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

  @ApiOkResponse({ type: InvoiceDto })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateInvoiceDto,
  ): Promise<InvoiceDto> {
    return this.invoicesService.update(id, data);
  }
}
