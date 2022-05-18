import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@importflow/dal';
import { UploadStatusEnum } from '@importflow/shared';

@Injectable()
export class FinalizeUpload {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string, headings: string[]) {
    return await this.uploadRepository.findOneAndUpdate(
      { _id: _uploadId },
      { status: UploadStatusEnum.MAPPED, headings }
    );
  }
}
