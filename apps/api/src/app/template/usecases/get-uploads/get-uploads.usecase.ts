import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@importflow/dal';
import { GetUploadsCommand } from './get-uploads.command';

@Injectable()
export class GetUploads {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(command: GetUploadsCommand) {
    return this.uploadRepository.find({ _templateId: command._templateId }, command.select);
  }
}
