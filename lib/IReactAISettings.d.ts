import { History } from 'history';
export default interface IReactAISettings {
    instrumentationKey: string;
    initialContext?: {
        [key: string]: any;
    };
    history?: History;
    debug?: boolean;
}
