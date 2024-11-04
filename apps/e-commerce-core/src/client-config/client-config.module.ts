import { Module } from '@nestjs/common';
import { ClientConfigService } from './client-config.service';

@Module({
  providers: [ClientConfigService],
  exports: [ClientConfigService],
})
export class ClientConfigModule {}
