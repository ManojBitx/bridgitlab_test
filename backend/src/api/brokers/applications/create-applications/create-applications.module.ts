import { BrokerApplicationsCreateController } from './create-applications.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [BrokerApplicationsCreateController],
})
export class BrokerApplicationsCreateModule {}
