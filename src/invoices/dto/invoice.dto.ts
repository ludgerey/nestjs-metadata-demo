import { ApiProperty } from '@nestjs/swagger';

export class InvoiceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: {
      accountingId: 'cust_42',
      erpId: '12345',
    },
  })
  metadata: Record<string, string>;
}
