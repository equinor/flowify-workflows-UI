import React from 'react';
import { Component, IVolume } from '../../../../models/v2';

export interface SecretsVolumesConfigProps {
  parameterConfig: { type: 'secret' | 'volume'; id: string } | undefined;
  setParameterConfig: any;
  component: Component | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  subcomponents: Component[] | undefined;
  type: 'workflow' | 'component';
  workspace?: string;
  workspaceSecrets?: string[];
  workspaceVolumes?: IVolume[];
}
