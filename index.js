var hasOwn = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

var reInsert = /\{([1-9]\d*|n)(?::((?:[^|]*\|)+?[^}]*))?\}/;

var texts;
var getPluralIndex;

/**
 * @typesign (context: string, key: string, plural: boolean, args: Array<string>): string;
 */
function getText(context, key, plural, args) {
	var rawText;

	if (hasOwn.call(texts, context) && hasOwn.call(texts[context], key)) {
		rawText = texts[context][key];

		if (plural) {
			rawText = rawText[getPluralIndex(args[0])];
		}
	} else {
		rawText = key;
	}

	var data = Object.create(null);

	for (var i = args.length; i;) {
		data[i] = args[--i];
	}

	if (plural) {
		data.n = args[0];
	}

	var text = [];

	rawText = rawText.split(reInsert);

	for (var j = 0, m = rawText.length; j < m;) {
		if (j % 3) {
			text.push(rawText[j + 1] ? rawText[j + 1].split('|')[getPluralIndex(data[rawText[j]])] : data[rawText[j]]);
			j += 2;
		} else {
			text.push(rawText[j]);
			j++;
		}
	}

	return text.join('');
}

function configure(config) {
	getText.localeSettings = config.localeSettings;

	texts = config.texts;
	getPluralIndex = Function('n', `return ${ config.localeSettings.plural };`);
}

function t(key) {
	return getText('', key, false, slice.call(arguments, 1));
}

function pt(key, context) {
	return getText(context, key, false, slice.call(arguments, 2));
}

function nt(key/*, count*/) {
	return getText('', key, true, slice.call(arguments, 1));
}

function npt(key, context/*, count*/) {
	return getText(context, key, true, slice.call(arguments, 2));
}

getText.configure = configure;
getText.t = t;
getText.pt = pt;
getText.nt = nt;
getText.npt = npt;

configure({
	localeSettings: {
		code: 'ru',
		plural: '(n%100) >= 5 && (n%100) <= 20 ? 2 : (n%10) == 1 ? 0 : (n%10) >= 2 && (n%10) <= 4 ? 1 : 2'
	},

	texts: {}
});

module.exports = getText.default = getText;
