import { BrokerApplicationsCreateModule } from './create-applications/create-applications.module';
import { BrokerApplicationsListModule } from './list-applications/list-applications.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [BrokerApplicationsListModule, BrokerApplicationsCreateModule],
})
export class BrokerApplicationsModule {}
