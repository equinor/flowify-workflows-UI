import { WorkflowsService } from './workflows-service';

interface Services {
  workflows: WorkflowsService;
}

export const services: Services = {
  workflows: new WorkflowsService(),
};
