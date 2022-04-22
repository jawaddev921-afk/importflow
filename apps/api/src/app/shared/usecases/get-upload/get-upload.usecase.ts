import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@importflow/dal';
import { GetUploadCommand } from './get-upload.command';

@Injectable()
export class GetUpload {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(command: GetUploadCommand) {
    return this.uploadRepository.findOne({ _id: command.uploadId }, command.select);
  }
}
