import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MongooseHealthIndicator,
    private readonly microCheck: MicroserviceHealthIndicator,
  ) {}

  @HealthCheck()
  @Get()
  isHealthy() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('/users')
  isUsersHealthy() {
    return this.microCheck.pingCheck('usersService', {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    });
  }
}
