import { ColumnTypesEnum } from '@importflow/shared';

export interface IExcelFileHeading {
  key: string;
  description?: string;
  isRequired?: boolean;
  isFrozen?: boolean;
  delimiter?: string;
  type: ColumnTypesEnum;
  selectValues?: string[];
  dateFormats?: string[];
  allowMultiSelect?: boolean;
}
