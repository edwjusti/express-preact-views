declare module "express-preact-views" {

    type EngineOptions = {
        transformViews?: boolean;
        doctype?: string;
        beautify?: boolean;
        babel?: any;
    };

    export function createEngine(options?: EngineOptions);
}