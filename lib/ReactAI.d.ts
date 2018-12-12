import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { IReactAISettings } from '.';
export default class ReactAI {
    static initialize(settings: IReactAISettings): void;
    static readonly Instance: ReactAI;
    static readonly RootInstance: ApplicationInsights;
    static readonly Context: {
        [key: string]: any;
    };
    static setContext(properties: {
        [key: string]: any;
    }, clearPrevious?: boolean): void;
    private static instance;
    private static ai;
    private static contextProps;
    private static debug?;
    private static customDimensionsInitializer;
    private static addHistoryListener;
    private constructor();
}
