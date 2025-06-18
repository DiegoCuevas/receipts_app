import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [CatsModule, ReceiptsModule],
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
