import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
  constructor(private config: ConfigService) {}

  get UsersClientOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: this.config.get<string>('clients.users.host', 'localhost'),
        port: +this.config.get<number>('clients.users.port', 3001),
      },
    };
  }
}
