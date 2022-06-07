import React, { createContext, useContext, useState } from 'react';
import { IImportFlowStore } from '../types';

interface ImportFlowContextProviderProps extends React.PropsWithChildren, Omit<IImportFlowStore, 'setTemplateId'> {}

const ImportFlowContext = createContext<IImportFlowStore | null>(null);

const ImportFlowContextProvider = ({
  projectId,
  templateId,
  authHeaderValue,
  extra,
  // other
  children,
}: ImportFlowContextProviderProps) => {
  const [stateTemplateId, setTemplateId] = useState<string | undefined>();

  return (
    <ImportFlowContext.Provider
      value={{
        projectId,
        templateId: templateId || stateTemplateId,
        authHeaderValue,
        setTemplateId,
        extra,
      }}
    >
      {children}
    </ImportFlowContext.Provider>
  );
};

export function useImportFlowState() {
  const context = useContext(ImportFlowContext);
  if (!context) throw new Error('ImportFlow Context must be used within ImportFlowContextProvider');

  return context;
}

export default ImportFlowContextProvider;
