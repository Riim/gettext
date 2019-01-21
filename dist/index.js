"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hasOwn = Object.prototype.hasOwnProperty;
var reInsert = /\{([1-9]\d*|n)(?::((?:[^|]*\|)+?[^}]*))?\}/;
var texts;
var getPluralIndex;
exports.getText = function getText(context, key, args) {
    var rawText;
    if (hasOwn.call(texts, context) && hasOwn.call(texts[context], key)) {
        rawText = texts[context][key];
    }
    else {
        rawText = key;
    }
    var data = {
        __proto__: null,
        n: args[0]
    };
    for (var i = args.length; i;) {
        data[i] = args[--i];
    }
    var splitted = rawText.split(reInsert);
    var text = [];
    for (var i = 0, l = splitted.length; i < l;) {
        if (i % 3) {
            text.push(splitted[i + 1]
                ? splitted[i + 1].split('|')[getPluralIndex(data[splitted[i]])]
                : data[splitted[i]]);
            i += 2;
        }
        else {
            text.push(splitted[i]);
            i++;
        }
    }
    return text.join('');
};
function set(config) {
    texts = config.texts;
    getPluralIndex = Function('n', "return " + config.localeSettings.plural + ";");
    exports.getText.localeSettings = config.localeSettings;
}
function t(key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return exports.getText('', key, args);
}
function pt(key, context) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return exports.getText(context, key, args);
}
exports.getText.set = set;
exports.getText.t = t;
exports.getText.pt = pt;
set({
    localeSettings: {
        code: 'ru',
        plural: '(n%100) >= 5 && (n%100) <= 20 ? 2 : (n%10) == 1 ? 0 : (n%10) >= 2 && (n%10) <= 4 ? 1 : 2'
    },
    texts: {}
});
