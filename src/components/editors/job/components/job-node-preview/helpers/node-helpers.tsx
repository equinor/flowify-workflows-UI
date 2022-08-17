import { NodeStatus, Workflow } from '../../../../../../models';
import { ANNOTATION_KEY_POD_NAME_VERSION } from '../../../../../../common/annotations';
import { getPodName, getTemplateNameFromNode } from '../../../../../../common/pod-name';

export const ensurePodName = (workflow: Workflow, node: NodeStatus, nodeID: string): string => {
  if (workflow && node) {
    let annotations: { [name: string]: string } = {};
    if (typeof workflow.metadata.annotations !== 'undefined') {
      annotations = workflow.metadata.annotations;
    }
    const version = annotations[ANNOTATION_KEY_POD_NAME_VERSION];
    const templateName = getTemplateNameFromNode(node);
    return getPodName(workflow.metadata.name!, node.name, templateName, node.id, version);
  }

  return nodeID;
};
