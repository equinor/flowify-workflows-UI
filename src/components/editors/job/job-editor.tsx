import React, { FC, useState } from 'react';
import { Progress } from '@equinor/eds-core-react';
import { Grid, Stack } from '@mui/material';
import { ObjectEditor } from '../../object-editor/object-editor';
import { Workflow } from '../../../models';
import { EditorCentralBar, EditorHeader } from '../components';
import { JobSidebar, JobGraph } from './components';
import { NodeDetails } from './components/job-node-preview/job-node-preview';
import { Helmet } from 'react-helmet-async';

interface JobViewerProps {
  job: Workflow | undefined;
  workspace: string;
  loading: boolean;
}

export const JobViewer: FC<JobViewerProps> = (props: JobViewerProps) => {
  const { job, loading } = props;
  const [useManifest, setUseManifest] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);
  console.log(job);
  return (
    <>
      <Helmet>
        <title>{job?.metadata?.name} - Job viewer - Flowify</title>
      </Helmet>
      <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        {selectedNodeId && (
          <NodeDetails
            workflowName={job?.metadata!.name!}
            nodeStatus={job?.status!.nodes[selectedNodeId]!}
            workflow={job!}
            onClose={() => setSelectedNodeId(undefined)}
            open
          />
        )}
        <Grid
          item
          xs={3}
          sx={{
            minHeight: '0',
            flexGrow: '1',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={2} padding="1rem">
            <EditorHeader name={job?.metadata?.name} type="Job" workspace={props.workspace} loading={loading} />
            {loading && !job ? (
              <Progress.Dots color="primary" />
            ) : (
              <JobSidebar job={job} inputs={job?.spec.arguments} />
            )}
          </Stack>
        </Grid>
        <Grid item xs={9} sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
          {loading && !job ? (
            <Progress.Dots color="primary" />
          ) : (
            <Stack
              direction="row"
              sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', height: '100%', width: '100%' }}
            >
              <EditorCentralBar setUseManifest={setUseManifest} type="job" />
              {useManifest ? (
                <ObjectEditor value={job} lang="yaml" />
              ) : (
                <JobGraph
                  workflowName={job?.metadata?.name!}
                  nodes={job?.status?.nodes!}
                  nodeClicked={(nodeId) => {
                    setSelectedNodeId(nodeId);
                  }}
                  setSelectedNodeId={setSelectedNodeId}
                />
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};
