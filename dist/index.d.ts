export interface ILocaleSettings {
    code: string;
    plural: string;
}
export interface ILocalizationTexts {
    [context: string]: {
        [key: string]: string;
    };
}
export interface IGetTextConfig {
    localeSettings: ILocaleSettings;
    texts: ILocalizationTexts;
}
export interface IGetText {
    localeSettings: ILocaleSettings;
    set(config: IGetTextConfig): void;
    (context: string, key: string, args: Array<any>): string;
    t(key: string, ...args: Array<any>): string;
    pt(key: string, context: string, ...args: Array<any>): string;
}
export declare const getText: IGetText;
