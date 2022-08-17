export const environment = {
  usingFlowifyServer: JSON.parse(process.env.REACT_APP_USING_FLOWIFY_SERVER ?? 'true') as boolean,
  baseUri: process.env.REACT_APP_BASE_URI ?? '/flowify-server/',
};
