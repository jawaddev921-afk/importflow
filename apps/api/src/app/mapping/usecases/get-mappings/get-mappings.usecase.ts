import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@importflow/dal';
import { ITemplateSchemaItem } from '@importflow/shared';

@Injectable()
export class GetMappings {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string): Promise<ITemplateSchemaItem[]> {
    const uploadInfo = await this.uploadRepository.findById(_uploadId, 'customSchema');

    return JSON.parse(uploadInfo.customSchema);
  }
}
