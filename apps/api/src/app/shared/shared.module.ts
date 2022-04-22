import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ColumnRepository,
  CommonRepository,
  DalService,
  FileRepository,
  MappingRepository,
  ProjectRepository,
  TemplateRepository,
  UploadRepository,
  UserRepository,
  EnvironmentRepository,
  CustomizationRepository,
  ValidatorRepository,
  WebhookDestinationRepository,
  BubbleDestinationRepository,
  UserJobRepository,
  JobMappingRepository,
  ProjectInvitationRepository,
  FailedWebhookRetryRequestsRepository,
  WebhookLogRepository,
} from '@importflow/dal';
import { StorageTypeEnum } from '@importflow/shared';
import { CSVFileService2, ExcelFileService } from './services/file/file.service';
import {
  S3StorageService,
  StorageService,
  EmailService,
  SESEmailService,
  FileNameService,
  NameService,
  AzureStorageService,
} from '@importflow/services';
import { WebSocketService } from './services';

const DAL_MODELS = [
  ProjectRepository,
  TemplateRepository,
  ColumnRepository,
  FileRepository,
  UploadRepository,
  MappingRepository,
  CommonRepository,
  UserRepository,
  EnvironmentRepository,
  CustomizationRepository,
  ValidatorRepository,
  WebhookDestinationRepository,
  BubbleDestinationRepository,
  UserJobRepository,
  JobMappingRepository,
  ProjectInvitationRepository,
  FailedWebhookRetryRequestsRepository,
  WebhookLogRepository,
];
const UTILITY_SERVICES = [CSVFileService2, FileNameService, NameService, ExcelFileService, WebSocketService];

const dalService = new DalService();

function getStorageServiceClass() {
  return process.env.STORAGE_TYPE === StorageTypeEnum.AZURE ? AzureStorageService : S3StorageService;
}

function getEmailServiceClass() {
  return SESEmailService;
}

const PROVIDERS = [
  {
    provide: DalService,
    useFactory: async () => {
      await dalService.connect(process.env.MONGO_URL);

      return dalService;
    },
  },
  ...DAL_MODELS,
  {
    provide: StorageService,
    useClass: getStorageServiceClass(),
  },
  {
    provide: EmailService,
    useClass: getEmailServiceClass(),
  },
  ...UTILITY_SERVICES,
  JwtService,
];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
