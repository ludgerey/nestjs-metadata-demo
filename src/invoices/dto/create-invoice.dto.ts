import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class MetadataDto {
  [key: string]: string;
}

export class CreateInvoiceDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsObject()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;
}
