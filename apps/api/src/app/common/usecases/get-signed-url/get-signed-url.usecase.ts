import { Injectable } from '@nestjs/common';
import { StorageService } from '@importflow/services';

@Injectable()
export class GetSignedUrl {
  constructor(private storageService: StorageService) {}

  async execute(key: string) {
    return this.storageService.getSignedUrl(key);
  }
}
