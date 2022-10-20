import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { JobViewer } from '../../components/editors/job/job-editor';
import { WorkflowJob } from '../../models/workflow-jobs';
import { services } from '../../services';
import { RetryWatch } from '../../common/retry-watch';
import { Container, Layout } from '../../layout';
import { Job } from '../../models/v2';

interface JobPageProps {}

export type LoadingEventsTypes = 'success' | 'loading' | 'failed';

// Fetch job from route.params then pass it down to JobView as prop
export const JobPage: React.FC<JobPageProps> = (props: JobPageProps): React.ReactElement => {
  const { workspace, id } = useParams();
  const [job, setJob] = useState<Job | undefined>();
  const [jobWatch, setJobWatch] = useState<WorkflowJob | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<LoadingEventsTypes>('loading');

  // TODO: handle error and delete
  useEffect(() => {
    services.jobs.get(id!).then((res) => {
      setJob(res);
      setLoading(false);
    });

    const retryWatch = new RetryWatch<WorkflowJob>(
      () => services.jobs.watch(id!),
      () => {},
      (res) => {
        console.log(res);
        //@ts-expect-error
        setJobWatch(res);
        setLoadingEvents('success');
      },
      () => {
        setLoadingEvents('failed');
      }, // Error
    );
    retryWatch.start();
    return () => retryWatch.stop();
  }, [workspace, id]);

  return (
    <Layout dashboard>
      <Container>
        {
          <JobViewer
            uid={id}
            workspace={workspace!}
            jobWatch={jobWatch}
            job={job}
            loading={loading}
            loadingEvents={loadingEvents}
          />
        }
      </Container>
    </Layout>
  );
};
