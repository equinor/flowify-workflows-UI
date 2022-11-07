import React from 'react';
import { Icon } from '@equinor/eds-core-react';
import { IconData } from '@equinor/eds-icons';
import { NodeProps, Handle, Position } from 'react-flow-renderer/nocss';
import { ICONS } from '@common';
import { NodePhase } from '../../../../models';

function phaseIcon(phase: NodePhase): string {
  return icons[phase.toLowerCase()]?.name ?? ICONS.warning_outlined.name;
}

function className(phase: NodePhase): string {
  switch (phase) {
    case 'Running':
      return 'rotate';
    case 'Pending':
      return 'rotate-slow';
    default:
      return '';
  }
}

function phaseColor(phase: NodePhase): string {
  switch (phase) {
    case 'Running':
      return 'orange';
    case 'Pending':
      return 'blue';
    case 'Succeeded':
      return 'green';
    case 'Error':
    case 'Failed':
    case 'Omitted':
    case 'Skipped':
      return 'red';
    default:
      return 'yellow';
  }
}

export const icons: { [key: string]: IconData } = {
  succeeded: ICONS.check_circle_outlined,
  pending: ICONS.walk,
  running: ICONS.run,
  error: ICONS.error_outlined,
};

export const ExecNode = ({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', columnGap: '1rem' }}>
      <Handle type="target" position={targetPosition} isConnectable={false} />
      <div>{data.label}</div>

      <Icon className={className(data.phase)} name={phaseIcon(data.phase)} size={18} color={phaseColor(data.phase)} />

      <Handle type="source" position={sourcePosition} isConnectable={false} />
    </div>
  );
};

export const HiddenNode = ({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => (
  <>
    <Handle type="target" position={targetPosition} isConnectable={false} />
    <Handle type="source" position={sourcePosition} isConnectable={false} />
  </>
);

ExecNode.displayName = 'ExecNode';
HiddenNode.displayName = 'HiddenNode';
