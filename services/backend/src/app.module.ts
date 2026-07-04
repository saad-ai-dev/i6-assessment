import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReposModule } from './modules/repos/repos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ReposModule,
  ],
})
export class AppModule {}
