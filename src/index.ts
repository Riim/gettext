const hasOwn = Object.prototype.hasOwnProperty;
const reInsert = /\{([1-9]\d*|n)(?::((?:[^|]*\|)+?[^}]*))?\}/;

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

let localeSettings: ILocaleSettings;
let translations: ITranslations;

let getPluralIndex: (n: number) => number;

export function getLocaleSettings(): ILocaleSettings | null {
	return localeSettings;
}

export function configure(config: IGetTextConfig) {
	localeSettings = config.localeSettings;
	translations = config.translations;

	getPluralIndex = Function('n', `return ${config.localeSettings.plural};`) as any;
}

configure({
	localeSettings: {
		code: 'ru',
		plural: '(n%100)>=5 && (n%100)<=20 ? 2 : (n%10)==1 ? 0 : (n%10)>=2 && (n%10)<=4 ? 1 : 2'
	},

	translations: {}
});

export function getText(msgctxt: string, msgid: string, args: Array<any>): string {
	let translation =
		hasOwn.call(translations, msgctxt) && hasOwn.call(translations[msgctxt], msgid)
			? translations[msgctxt][msgid]
			: msgid;

	let data: any = {
		__proto__: null,
		n: args[0]
	};

	for (let i = args.length; i; ) {
		data[i] = args[--i];
	}

	let splitted = translation.split(reInsert);
	let text: Array<string> = [];

	for (let i = 0, l = splitted.length; i < l; ) {
		if (i % 3) {
			text.push(
				splitted[i + 1]
					? splitted[i + 1].split('|')[getPluralIndex(data[splitted[i]])]
					: data[splitted[i]]
			);

			i += 2;
		} else {
			text.push(splitted[i]);
			i++;
		}
	}

	return text.join('');
}

export function t(msgid: string, ...args: Array<any>) {
	return getText('', msgid, args);
}

export function pt(msgctxt: string, msgid: string, ...args: Array<any>) {
	return getText(msgctxt, msgid, args);
}
