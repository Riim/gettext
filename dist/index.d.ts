export interface ILocaleSettings {
    code: string;
    plural: string;
}
export interface ITranslations {
    [msgctxt: string]: {
        [msgid: string]: string;
    };
}
export interface IGetTextConfig {
    localeSettings: ILocaleSettings;
    translations: ITranslations;
}
export declare function getLocaleSettings(): ILocaleSettings | null;
export declare function configure(config: IGetTextConfig): void;
export declare function getText(msgctxt: string, msgid: string, args: Array<any>): string;
export declare function t(msgid: string, ...args: Array<any>): string;
export declare function pt(msgctxt: string, msgid: string, ...args: Array<any>): string;
