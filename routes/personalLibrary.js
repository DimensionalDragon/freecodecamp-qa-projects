'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Book = require('../models/book');

router.route('/api/books')
    .get(async (req, res) => {
        let books;
        try {
            books = await Book.find();
            res.json(books.map(book => ({
                _id: book._id,
                title: book.title,
                commentcount: book.comments.length
            })));
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'Could not get books'});
        }
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async (req, res) => {
        if(!req.body.title) return res.json('missing required field title');
        const book = new Book({title: req.body.title});
        try {
            await book.save();
            res.json(book);
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'Could not save book'});
        }
        //response will contain new book object including atleast _id and title
    })

    .delete(async (req, res) => {
        try {
            await Book.deleteMany({});
            res.json('complete delete successful')
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'Could not delete books'});
        }
        //if successful response will be 'complete delete successful'
    });



router.route('/api/books/:id')
    .get(async (req, res) => {
        let bookid = mongoose.Types.ObjectId(req.params.id);
        let book;
        try {
            book = await Book.findById(bookid);
            if(!book) return res.json('no book exists');
            res.json(book);
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'Could not get book'});
        }
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async (req, res) => {
        if(!req.body.comment) return res.json('missing required field comment');
        let bookid = mongoose.Types.ObjectId(req.params.id);
        let comment = req.body.comment;
        let book;
        try {
            book = await Book.findById(bookid);
            if(!book) return res.json('no book exists');
            book.comments.push(comment);
            await book.save();
            res.json(book);
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'Could not add comment'});
        }
        //json res format same as .get
    })

    .delete(async (req, res) => {
        if(!req.params.id) return res.json({error: 'missing required field id'});
        let bookid = mongoose.Types.ObjectId(req.params.id);
        let book;
        try {
            book = await Book.findByIdAndDelete(bookid);
            if(!book) return res.json('no book exists');
            res.json('delete successful')
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'Could not delete book'});
        }
        //if successful response will be 'delete successful'
    });

module.exports = router;