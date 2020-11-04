const express = require('express')
const router = express.Router()
const Book = require('../models/book')


router.get('/', async (req, res) => {
    let books
    try {
        // Sorta em ordem descendente ('desc') e limita em 10 resultados
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()

    } catch {
        books = []
    }
    res.render('index', { books: books })
})




module.exports = router