import { Injectable } from '@nestjs/common';
import { CustomizationRepository } from '@importflow/dal';
import { createVariable } from '@importflow/shared';

@Injectable()
export class GetCustomization {
  constructor(private customizationRepository: CustomizationRepository) {}

  async execute(_templateId: string) {
    const customization = await this.customizationRepository.findOne({ _templateId });

    return {
      ...customization,
      chunkVariables: customization?.chunkVariables?.map((variable) => createVariable(variable)) || [],
      recordVariables: customization?.recordVariables?.map((variable) => createVariable(variable)) || [],
    };
  }
}
