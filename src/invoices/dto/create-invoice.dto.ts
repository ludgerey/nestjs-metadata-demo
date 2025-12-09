import { IsNumber, IsOptional } from 'class-validator';
import { IsMetadata } from '../../shared/decorators/is-metadata.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: {
      accountingId: 'cust_42',
      erpId: '12345',
    },
    description:
      'Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.',
  })
  @IsOptional()
  @IsMetadata()
  metadata?: Record<string, string>;
}
