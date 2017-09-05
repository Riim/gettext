"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hasOwn = Object.prototype.hasOwnProperty;
var reInsert = /\{([1-9]\d*|n)(?::((?:[^|]*\|)+?[^}]*))?\}/;
var texts;
var getPluralIndex;
exports.getText = function getText(context, key, plural, args) {
    var rawText;
    if (hasOwn.call(texts, context) && hasOwn.call(texts[context], key)) {
        rawText = plural ?
            texts[context][key][getPluralIndex(+args[0])] :
            texts[context][key];
    }
    else {
        rawText = key;
    }
    var data = Object.create(null);
    for (var i = args.length; i;) {
        data[i] = args[--i];
    }
    if (plural) {
        data.n = args[0];
    }
    var splittedRawText = rawText.split(reInsert);
    var text = [];
    for (var i = 0, l = splittedRawText.length; i < l;) {
        if (i % 3) {
            text.push(splittedRawText[i + 1] ?
                splittedRawText[i + 1].split('|')[getPluralIndex(data[splittedRawText[i]])] :
                data[splittedRawText[i]]);
            i += 2;
        }
        else {
            text.push(splittedRawText[i]);
            i++;
        }
    }
    return text.join('');
};
function configure(config) {
    texts = config.texts;
    getPluralIndex = Function('n', "return " + config.localeSettings.plural + ";");
    exports.getText.localeSettings = config.localeSettings;
}
function t(key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return exports.getText('', key, false, args);
}
function pt(key, context) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return exports.getText(context, key, false, args);
}
function nt(key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return exports.getText('', key, true, args);
}
function npt(key, context) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return exports.getText(context, key, true, args);
}
exports.getText.configure = configure;
exports.getText.t = t;
exports.getText.pt = pt;
exports.getText.nt = nt;
exports.getText.npt = npt;
configure({
    localeSettings: {
        code: 'ru',
        plural: '(n%100) >= 5 && (n%100) <= 20 ? 2 : (n%10) == 1 ? 0 : (n%10) >= 2 && (n%10) <= 4 ? 1 : 2'
    },
    texts: {}
});
