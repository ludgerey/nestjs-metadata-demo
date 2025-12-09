import { IsOptional } from 'class-validator';
import { IsMetadata } from '../../shared/decorators/is-metadata.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindInvoicesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMetadata()
  metadata?: Record<string, string>;
}
