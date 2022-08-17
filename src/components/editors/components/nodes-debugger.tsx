import React, { useState } from 'react';
import { ControlButton } from 'react-flow-renderer';

export const NodesDebugger: React.FC = (): React.ReactElement => {
  const [debug, setDebug] = useState(false);
  //const nodes = useStoreState((state) => state.nodes);
  //const edges = useStoreState((state) => state.edges);
  //if (debug) console.log(nodes, edges);

  return (
    <ControlButton onClick={() => setDebug(!debug)}>
      <i className="fa fa-info-circle" style={{ color: debug ? 'red' : 'grey' }} />
    </ControlButton>
  );
};
