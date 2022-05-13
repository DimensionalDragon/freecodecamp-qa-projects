const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')
const britishToAmericanSpelling = {};
Object.keys(americanToBritishSpelling).forEach(key => {
    britishToAmericanSpelling[americanToBritishSpelling[key]] = key;
});
const britishToAmericanTitles = {};
Object.keys(americanToBritishTitles).forEach(key => {
    britishToAmericanTitles[americanToBritishTitles[key]] = key;
});

class Translator {
    caseSensitiveTranslate(phrase, translateMap) {
        const words = phrase.split(' ');
        const isUpperCase = new Array(words.length).fill(false).map((_, i) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(words[i][0]));
        const translation = (translateMap[phrase.toLowerCase()] || phrase).split(' ');
        const result = translation.map((word, i) => {
            if(word === undefined) return words[i];
            if(isUpperCase[i]) return word[0].toUpperCase() + word.substring(1);
            return word;
        }).join(' ');
        if(result === phrase) return undefined;
        return '<span class="highlight">' + result + '</span>';
    }

    translate(text, originLang) {
        const translateMap = (originLang === 'american') ? americanOnly : britishOnly;
        const spellingMap = (originLang === 'american') ? americanToBritishSpelling : britishToAmericanSpelling;
        const titleMap = (originLang === 'american') ? americanToBritishTitles : britishToAmericanTitles;
        const punctuation = text[text.length - 1];
        const words = text.substring(0, text.length - 1).split(' ');
        const translation = words.map((word, i) => {
            if(originLang === 'american') word = word.replace(/(\d{1,2}):(\d{2})/, '<span class="highlight">$1.$2</span>');
            if(originLang === 'british') word = word.replace(/(\d{1,2})\.(\d{2})/, '<span class="highlight">$1:$2</span>');
            for(let j = 2; j >= 1; j--) {
                const phrase = new Array(j + 1).fill('').map((_, k) => (k === 0) ? word : words[i + k]).join(' ');
                if(translateMap[phrase.toLowerCase()]) {
                    for(let k = 1; k <= j; k++) {
                        word = word + ' ' + words[i + k];
                        words[i + k] = '';
                    }
                    return this.caseSensitiveTranslate(word, translateMap);
                }
            }
            return this.caseSensitiveTranslate(word, translateMap) || this.caseSensitiveTranslate(word, spellingMap) || this.caseSensitiveTranslate(word, titleMap) || word;
        }).filter(word => word !== '').join(' ') + punctuation;
        return {
            text: translation.replace(/<span class="highlight">(.*?)<\/span>/g, '$1'),
            html: translation
        };
    }
}

module.exports = Translator;