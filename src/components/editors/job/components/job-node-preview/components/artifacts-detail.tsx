import React from 'react';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import { services } from '@services';
import { Stack } from '@ui';
import { environment } from '../../../../../../environments/environment';
import { Artifact, NodeStatus, Workflow } from '../../../../../../models';

interface ArtifactsProps {
  workflow: Workflow;
  node: NodeStatus;
  isInput: boolean;
  artifacts?: Artifact[];
}
export const ArtifactsDetail: React.FC<ArtifactsProps> = ({
  workflow,
  node,
  isInput,
  artifacts,
}: ArtifactsProps): React.ReactElement => {
  const artifactsDetails =
    artifacts?.map((artifact) =>
      Object.assign({}, artifact, {
        downloadUrl: services.workflows_deprecated.getArtifactDownloadUrl(
          workflow,
          node.id,
          artifact.name,
          false,
          isInput,
        ),
        stepName: node.name,
        dateCreated: node.finishedAt,
        nodeName: node.name,
      }),
    ) || [];

  return (
    <Stack>
      <Typography variant="h6">Artifacts</Typography>
      {artifactsDetails === undefined || artifactsDetails?.length === 0 ? (
        <Typography variant="body_short">No artifacts</Typography>
      ) : (
        <Stack spacing={0.5} style={{ marginTop: '0.5rem' }}>
          {artifactsDetails.map((artifact) => (
            <Stack
              alignItems="flex-start"
              spacing={0.5}
              style={{ borderLeft: '3px solid #007079', padding: '0.5rem 1rem' }}
            >
              <Typography variant="body_short">
                <b>Name: </b>
                {artifact.name}
              </Typography>
              <Typography variant="body_short">
                <b>Node name: </b>
                {artifact.nodeName}
              </Typography>
              <Typography variant="body_short">
                <b>Path: </b>
                {artifact.path}
              </Typography>
              <Button variant="outlined" href={environment.baseUri + artifact.downloadUrl}>
                <Icon name="download" size={16} />
                Download
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
