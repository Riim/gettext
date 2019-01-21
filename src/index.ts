const hasOwn = Object.prototype.hasOwnProperty;

const reInsert = /\{([1-9]\d*|n)(?::((?:[^|]*\|)+?[^}]*))?\}/;

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

let texts: ILocalizationTexts;
let getPluralIndex: (n: number) => number;

export const getText = function getText(context: string, key: string, args: Array<any>): string {
	let rawText: string;

	if (hasOwn.call(texts, context) && hasOwn.call(texts[context], key)) {
		rawText = texts[context][key];
	} else {
		rawText = key;
	}

	let data: any = {
		__proto__: null,
		n: args[0]
	};

	for (let i = args.length; i; ) {
		data[i] = args[--i];
	}

	let splitted = rawText.split(reInsert);
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
} as IGetText;

function set(config: IGetTextConfig) {
	texts = config.texts;
	getPluralIndex = Function('n', `return ${config.localeSettings.plural};`) as (
		n: number
	) => number;

	getText.localeSettings = config.localeSettings;
}

function t(key: string, ...args: Array<any>) {
	return getText('', key, args);
}

function pt(key: string, context: string, ...args: Array<any>) {
	return getText(context, key, args);
}

getText.set = set;
getText.t = t;
getText.pt = pt;

set({
	localeSettings: {
		code: 'ru',
		plural:
			'(n%100) >= 5 && (n%100) <= 20 ? 2 : (n%10) == 1 ? 0 : (n%10) >= 2 && (n%10) <= 4 ? 1 : 2'
	},

	texts: {}
});
