const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Unit Tests', () => {
    // Translate Mangoes are my favorite fruit. to British English
    test('Mangoes are my favorite fruit. to British English', done => {
        assert.strictEqual(translator.translate('Mangoes are my favorite fruit.', 'american').text, 'Mangoes are my favourite fruit.')
        done();
    });

    // Translate I ate yogurt for breakfast. to British English
    test('I ate yogurt for breakfast. to British English', done => {
        assert.strictEqual(translator.translate('I ate yogurt for breakfast.', 'american').text, 'I ate yoghurt for breakfast.')
        done();
    });

    // Translate We had a party at my friend's condo. to British English
    test('We had a party at my friend\'s condo. to British English', done => {
        assert.strictEqual(translator.translate('We had a party at my friend\'s condo.', 'american').text, 'We had a party at my friend\'s flat.')
        done();
    });

    // Translate Can you toss this in the trashcan for me? to British English
    test('Can you toss this in the trashcan for me? to British English', done => {
        assert.strictEqual(translator.translate('Can you toss this in the trashcan for me?', 'american').text, 'Can you toss this in the bin for me?')
        done();
    });

    // Translate The parking lot was full. to British English
    test('The parking lot was full. to British English', done => {
        assert.strictEqual(translator.translate('The parking lot was full.', 'american').text, 'The car park was full.')
        done();
    });

    // Translate Like a high tech Rube Goldberg machine. to British English
    test('Like a high tech Rube Goldberg machine. to British English', done => {
        assert.strictEqual(translator.translate('Like a high tech Rube Goldberg machine.', 'american').text, 'Like a high tech Heath Robinson device.')
        done();
    });

    // Translate To play hooky means to skip class or work. to British English
    test('To play hooky means to skip class or work. to British English', done => {
        assert.strictEqual(translator.translate('To play hooky means to skip class or work.', 'american').text, 'To bunk off means to skip class or work.')
        done();
    });

    // Translate No Mr. Bond, I expect you to die. to British English
    test('No Mr. Bond, I expect you to die. to British English', done => {
        assert.strictEqual(translator.translate('No Mr. Bond, I expect you to die.', 'american').text, 'No Mr Bond, I expect you to die.')
        done();
    });

    // Translate Dr. Grosh will see you now. to British English
    test('Dr. Grosh will see you now. to British English', done => {
        assert.strictEqual(translator.translate('Dr. Grosh will see you now.', 'american').text, 'Dr Grosh will see you now.')
        done();
    });

    // Translate Lunch is at 12:15 today. to British English
    test('Lunch is at 12:15 today. to British English', done => {
        assert.strictEqual(translator.translate('Lunch is at 12:15 today.', 'american').text, 'Lunch is at 12.15 today.')
        done();
    });

    // Translate We watched the footie match for a while. to American English
    test('We watched the footie match for a while. to American English', done => {
        assert.strictEqual(translator.translate('We watched the footie match for a while.', 'british').text, 'We watched the soccer match for a while.')
        done();
    });

    // Translate Paracetamol takes up to an hour to work. to American English
    test('Paracetamol takes up to an hour to work. to American English', done => {
        assert.strictEqual(translator.translate('Paracetamol takes up to an hour to work.', 'british').text, 'Tylenol takes up to an hour to work.')
        done();
    });

    // Translate First, caramelise the onions. to American English
    test('First, caramelise the onions. to American English', done => {
        assert.strictEqual(translator.translate('First, caramelise the onions.', 'british').text, 'First, caramelize the onions.')
        done();
    });

    // Translate I spent the bank holiday at the funfair. to American English
    test('I spent the bank holiday at the funfair. to American English', done => {
        assert.strictEqual(translator.translate('I spent the bank holiday at the funfair.', 'british').text, 'I spent the public holiday at the carnival.')
        done();
    });

    // Translate I had a bicky then went to the chippy. to American English
    test('I had a bicky then went to the chippy. to American English', done => {
        assert.strictEqual(translator.translate('I had a bicky then went to the chippy.', 'british').text, 'I had a cookie then went to the fish-and-chip shop.')
        done();
    });

    // Translate I've just got bits and bobs in my bum bag. to American English
    test('I\'ve just got bits and bobs in my bum bag. to American English', done => {
        assert.strictEqual(translator.translate('I\'ve just got bits and bobs in my bum bag.', 'british').text, 'I\'ve just got odds and ends in my fanny pack.')
        done();
    });

    // Translate The car boot sale at Boxted Airfield was called off. to American English
    test('The car boot sale at Boxted Airfield was called off. to American English', done => {
        assert.strictEqual(translator.translate('The car boot sale at Boxted Airfield was called off.', 'british').text, 'The swap meet at Boxted Airfield was called off.')
        done();
    });

    // Translate Have you met Mrs Kalyani? to American English
    test('Have you met Mrs Kalyani? to American English', done => {
        assert.strictEqual(translator.translate('Have you met Mrs Kalyani?', 'british').text, 'Have you met Mrs. Kalyani?')
        done();
    });

    // Translate Prof Joyner of King's College, London. to American English
    test('Prof Joyner of King\'s College, London. to American English', done => {
        assert.strictEqual(translator.translate('Prof Joyner of King\'s College, London.', 'british').text, 'Prof. Joyner of King\'s College, London.')
        done();
    });

    // Translate Tea time is usually around 4 or 4.30. to American English
    test('Tea time is usually around 4 or 4.30. to American English', done => {
        assert.strictEqual(translator.translate('Tea time is usually around 4 or 4.30.', 'british').text, 'Tea time is usually around 4 or 4:30.')
        done();
    });

    // Highlight translation in Mangoes are my favorite fruit.
    test('Highlight Mangoes are my favorite fruit.', done => {
        assert.strictEqual(translator.translate('Mangoes are my favorite fruit.', 'american').html, 'Mangoes are my <span class="highlight">favourite</span> fruit.');
        done();
    });

    // Highlight translation in I ate yogurt for breakfast.
    test('Highlight I ate yogurt for breakfast.', done => {
        assert.strictEqual(translator.translate('I ate yogurt for breakfast.', 'american').html, 'I ate <span class="highlight">yoghurt</span> for breakfast.');
        done();
    });

    // Highlight translation in We watched the footie match for a while.
    test('Highlight We watched the footie match for a while.', done => {
        assert.strictEqual(translator.translate('We watched the footie match for a while.', 'british').html, 'We watched the <span class="highlight">soccer</span> match for a while.');
        done();
    });

    // Highlight translation in Paracetamol takes up to an hour to work.
    test('Highlight Paracetamol takes up to an hour to work.', done => {
        assert.strictEqual(translator.translate('Paracetamol takes up to an hour to work.', 'british').html, '<span class="highlight">Tylenol</span> takes up to an hour to work.');
        done();
    });
});
