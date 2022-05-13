'use strict';

const express = require('express');
const router = express.Router();

const Translator = require('../components/translator.js');
const translator = new Translator();

router.post('/api/translate', (req, res) => {
    const langMap = {
        'american-to-british': 'american',
        'british-to-american': 'british'
    }
    if(req.body.text === undefined || req.body.locale === undefined) return res.json({error: 'Required field(s) missing'});
    if(req.body.text === '') return res.json({error: 'No text to translate'});
    if(!langMap[req.body.locale]) return res.json({error: 'Invalid value for locale field'});

    const {text} = req.body;
    const {html: translation} = translator.translate(req.body.text, langMap[req.body.locale]);
    if(!translation.includes('<span class="highlight">')) return res.json({text, translation: 'Everything looks good to me!'});
    return res.json({text, translation});
});

module.exports = router;