import { IsOptional } from 'class-validator';
import { IsMetadata } from '../../shared/decorators/is-metadata.decorator';

export class FindInvoicesQueryDto {
  @IsOptional()
  @IsMetadata()
  metadata?: Record<string, string>;
}
