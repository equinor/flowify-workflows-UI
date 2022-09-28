import { WorkflowsService } from './workflows-service';
import { ComponentService } from './component-service';
import { UserInfoService } from './userinfo-service';
import { SecretService } from './secret-service';
import { WorkflowService } from './workflow-service';
import { JobService } from './job-service';
import { WorkspaceService } from './workspace-service';
import { VolumeService } from './volume-service';

interface Services {
  workflows_deprecated: WorkflowsService;
  components: ComponentService;
  userinfo: UserInfoService;
  workflows: WorkflowService;
  secrets: SecretService;
  jobs: JobService;
  workspace: WorkspaceService;
  volumes: VolumeService;
}

export const services: Services = {
  workflows_deprecated: new WorkflowsService(),
  components: new ComponentService(),
  userinfo: new UserInfoService(),
  workflows: new WorkflowService(),
  secrets: new SecretService(),
  jobs: new JobService(),
  workspace: new WorkspaceService(),
  volumes: new VolumeService(),
};

export * from './filters';
