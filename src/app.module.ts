import { Module } from '@nestjs/common';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [ReceiptsModule],
})
export class AppModule {
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      import('../prisma/seed.mjs').then(() => {
        console.log('Seeder ejecutado automáticamente en desarrollo');
      });
    }
  }
}
