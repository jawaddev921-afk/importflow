import { DestinationsEnum, IntegrationEnum } from '@importflow/shared';

export class TemplateEntity {
  _id?: string;

  name: string;

  destination: DestinationsEnum;

  sampleFileUrl: string;

  _projectId: string;

  totalUploads: number;

  totalRecords: number;

  totalInvalidRecords: number;

  mode: string;

  imageColumns: string[];

  integration: IntegrationEnum;

  expectedDateFormat: string;
}
