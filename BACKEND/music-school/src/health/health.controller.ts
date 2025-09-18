import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
// import { Connection } from 'typeorm/connection/Connection';
// import { Connection } from 'typeorm';
// import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    // @InjectConnection('music-school')
    // private musicSchool: default,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Get('/monitoring')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      // () => this.db.pingCheck('database'),
      () =>
        this.db.pingCheck('mongoDB', {
          // connection: this.musicSchool,
        }),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB,
      () => this.mongoose.pingCheck('mongoose'),
    ]);
  }

  @Get('/healtz')
  getGreetings(): string {
    return 'Hello! The service is up and running.';
  }

  // Within the `HealthController`-class

  // @Get()
  // @HealthCheck()
  // rescheck() {
  //   return this.health.check([
  //     () =>
  //       this.http.responseCheck(
  //         'my-external-service',
  //         'https://my-external-service.com',
  //         (res) => res.status === 204,
  //       ),
  //     () => this.db.pingCheck('database'),
  //     () =>
  //       this.db.pingCheck('mongoDB', {
  //         // connection: this.musicSchool,
  //       }),
  //     () =>
  //       this.disk.checkStorage('storage', {
  //         path: '/',
  //         threshold: 250 * 1024 * 1024,
  //       }),
  //     () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB
  //     () => this.mongoose.pingCheck('mongoose'),
  //   ]);
  // }
}
