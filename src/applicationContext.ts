import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReceiptsService } from './receipts/receipts.service';
import { ReceiptsModule } from './receipts/receipts.module';

export interface ApplicationContext {
  receiptsService: ReceiptsService;
}

// Mounting the application as bare Nest standalone application so that we can use
// the Nest services inside our Encore endpoints
const applicationContext: Promise<ApplicationContext> =
  NestFactory.createApplicationContext(AppModule).then((app) => {
    return {
      receiptsService: app.select(ReceiptsModule).get(ReceiptsService, { strict: true }),
    };
  });

export default applicationContext;
