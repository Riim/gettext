"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hasOwn = Object.prototype.hasOwnProperty;
var reInsert = /\{([1-9]\d*|n)(?::((?:[^|]*\|)+?[^}]*))?\}/;
var localeSettings;
var translations;
var getPluralIndex;
function getLocaleSettings() {
    return localeSettings;
}
exports.getLocaleSettings = getLocaleSettings;
function configure(config) {
    localeSettings = config.localeSettings;
    translations = config.translations;
    getPluralIndex = Function('n', "return " + config.localeSettings.plural + ";");
}
exports.configure = configure;
configure({
    localeSettings: {
        code: 'ru',
        plural: '(n%100)>=5 && (n%100)<=20 ? 2 : (n%10)==1 ? 0 : (n%10)>=2 && (n%10)<=4 ? 1 : 2'
    },
    translations: {}
});
function getText(msgctxt, msgid, args) {
    var translation = hasOwn.call(translations, msgctxt) && hasOwn.call(translations[msgctxt], msgid)
        ? translations[msgctxt][msgid]
        : msgid;
    var data = {
        __proto__: null,
        n: args[0]
    };
    for (var i = args.length; i;) {
        data[i] = args[--i];
    }
    var splitted = translation.split(reInsert);
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
}
exports.getText = getText;
function t(msgid) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return getText('', msgid, args);
}
exports.t = t;
function pt(msgctxt, msgid) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return getText(msgctxt, msgid, args);
}
exports.pt = pt;
