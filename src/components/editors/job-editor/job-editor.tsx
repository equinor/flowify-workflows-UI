import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Progress } from '@equinor/eds-core-react';
import { Job } from '@models/v2';
import { services } from '@services';
import { Stack, Grid, Breadcrumbs } from '@ui';
import { NodeDetails } from './components/job-node-preview/job-node-preview';
import { ManifestEditor } from '../manifest-editor/manifest-editor';
import { Workflow } from '../../../models';
import { EditorCentralBar } from '../components';
import { JobSidebar, JobGraph } from './components';
import { LoadingEventsTypes } from '../../../pages/job/job-page';

interface JobViewerProps {
  job: Job | undefined;
  jobWatch: Workflow | undefined;
  workspace: string;
  loading: boolean;
  uid: string | undefined;
  loadingEvents: LoadingEventsTypes;
}

export const JobViewer: FC<JobViewerProps> = (props: JobViewerProps) => {
  const { jobWatch, loading, uid, job, workspace } = props;
  const [useManifest, setUseManifest] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  function onTerminate() {
    services.jobs
      .terminate(uid!)
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  }

  function onDelete() {
    services.jobs
      .delete(uid!)
      .then(
        () => {
          navigate(`/workspace/${workspace}`);
        },
        (error) => console.error(error),
      )
      .catch((error) => console.error(error));
  }

  return (
    <>
      <Helmet>
        <title>{jobWatch?.metadata?.name || ''} - Job viewer - Flowify</title>
      </Helmet>
      <Grid container style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Grid
          item
          xs={3}
          style={{
            minHeight: '0',
            flexGrow: '1',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={2} padding={1}>
            <Breadcrumbs
              links={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: workspace, href: `/workspace/${workspace}` },
                { title: 'Job editor' },
              ]}
            />
            {loading && !jobWatch ? (
              <Progress.Dots color="primary" />
            ) : (
              <JobSidebar
                jobWatch={jobWatch}
                job={job}
                inputs={jobWatch?.spec.arguments}
                onTerminate={onTerminate}
                onDelete={onDelete}
              />
            )}
          </Stack>
        </Grid>
        <Grid item xs={9} style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
          {loading && !jobWatch ? (
            <Progress.Dots color="primary" />
          ) : (
            <Stack
              direction="row"
              style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', height: '100%', width: '100%' }}
            >
              <EditorCentralBar setUseManifest={setUseManifest} />
              {useManifest ? (
                <ManifestEditor value={jobWatch} lang="yaml" />
              ) : (
                <JobGraph
                  workflowName={jobWatch?.metadata?.name!}
                  nodes={jobWatch?.status?.nodes!}
                  nodeClicked={(nodeId) => {
                    setSelectedNodeId(nodeId);
                  }}
                  setSelectedNodeId={setSelectedNodeId}
                  loadingEvents={props.loadingEvents}
                />
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
      {selectedNodeId && (
        <NodeDetails
          workflowName={jobWatch?.metadata!.name!}
          nodeStatus={jobWatch?.status!.nodes[selectedNodeId]!}
          workflow={jobWatch!}
          onClose={() => setSelectedNodeId(undefined)}
          open
        />
      )}
    </>
  );
};
