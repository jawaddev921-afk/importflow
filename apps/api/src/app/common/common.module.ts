import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { UploadRepository } from '@importflow/dal';
import { CommonController } from './common.controller';
import { SharedModule } from '@shared/shared.module';
import { PaymentAPIService } from '@importflow/services';

@Module({
  imports: [SharedModule, UploadRepository],
  providers: [...USE_CASES, PaymentAPIService],
  controllers: [CommonController],
})
export class CommonModule {}
