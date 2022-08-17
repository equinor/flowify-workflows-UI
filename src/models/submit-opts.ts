import { Parameter } from './index'

export interface SubmitOpts {
    entryPoint?: string;
    parameters?: Parameter[];
    labels?: string[];
    annotations?: Annotation[]
}


export interface Annotation {
    name: string;
    value?: string;
}
