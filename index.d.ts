declare type EngineOptions = {
    transformViews: boolean;
    doctype: string;
    beautify: boolean;
    babel: any;
}
declare function createEngine(options?: EngineOptions)