import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@importflow/dal';
import { ITemplateSchemaItem } from '@importflow/shared';

@Injectable()
export class UpdateMappings {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(templateSchema: ITemplateSchemaItem[], _uploadId: string) {
    await this.uploadRepository.update(
      {
        _id: _uploadId,
      },
      { customSchema: JSON.stringify(templateSchema) }
    );
  }
}
