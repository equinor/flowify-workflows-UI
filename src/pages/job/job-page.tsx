import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { JobViewer } from '../../components/editors/job/job-editor';
import { WorkflowJob } from '../../models/workflow-jobs';
import { services } from '../../services/v2';
import { RetryWatch } from '../../common/retry-watch';
import { Container, Layout } from '../../layout';

interface JobPageProps {}

// Fetch job from route.params then pass it down to JobView as prop
export const JobPage: React.FC<JobPageProps> = (props: JobPageProps): React.ReactElement => {
  const { workspace, id } = useParams();
  const [job, setWorkflow] = useState<WorkflowJob | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  // TODO: handle error and delete
  useEffect(() => {
    const retryWatch = new RetryWatch<WorkflowJob>(
      () => services.jobs.watch(id!),
      () => {},
      (res) => {
        //@ts-expect-error
        setWorkflow(res);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }, // Error
    );
    retryWatch.start();
    return () => retryWatch.stop();
  }, [workspace, id]);

  return (
    <Layout dashboard>
      <Container>{<JobViewer workspace={workspace!} job={job} loading={loading} />}</Container>
    </Layout>
  );
};
