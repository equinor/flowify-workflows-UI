export interface IParameterConfig {
  type: 'secret' | 'volume';
  id: string;
}

export interface IFunctionalCompConfig {
  type: 'map' | 'if';
  id: string;
}
