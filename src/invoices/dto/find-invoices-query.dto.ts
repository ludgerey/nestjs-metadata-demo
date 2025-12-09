import { IsOptional } from 'class-validator';
import { IsMetadata } from '../../shared/decorators/is-metadata.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindInvoicesQueryDto {
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: 'metadata[accountingId]=cust_42&metadata[erpId]=12345',
    description:
      'Filter invoices by metadata key-value pairs. Use the format metadata[key]=value to filter results based on specific metadata.',
  })
  @IsOptional()
  @IsMetadata()
  metadata?: Record<string, string>;
}
