export interface IValidationError {
  message: string;
  path: string;
  value: any;
  params: {
    parsedValue?: string | undefined;
    nodeid?: string;
  };
  type: string;
}
