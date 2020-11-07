const express = require('express')
const Book = require('../models/book')
const Author = require('../models/author')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

const path = require('path')
const { db } = require('../models/book')
const uploadPath = path.join('public', Book.coverImageBasePath)

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype)) //-------->> Estudar isso depois!!
    }
})


// All books route

router.get('/', async (req,res) => {
    let query = Book.find() // Isso retorna uma query vazia, ao inves de uma query consumada
    if (req.query.title != null && req.query.title != ''){
        console.log('Query title')
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
        console.log('Query publishedBefore')

        query = query.lte('publishDate', req.query.publishedBefore)
        // 'publishedDate' é o field que queremos checar em nossa database!
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
        console.log('Query publishedAfter')

        const myDate = new Date(req.query.publishedAfter).toISOString()
        const myDate2 = new Date(myDate)
        console.log(`Essa é a minha nova data: ${myDate2}`)
        
        

        query = query.gte('publishDate', myDate)
        newBooks = Book.find({})

    }
    try {
        const books = await query.exec()
        console.log(`Livros da query executada: ${books[0]}`)
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }


})

// New book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create book route
// O 'cover' é o nome do file input, do HTML
// Diz ao multer pra uploadar o input 'cover' no determinado path
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        // author: "5f9f5e106e19c32993aaf900",
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName
    })
    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
        // res.redirect('books')
    } catch (error) {
        console.log(error)
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true) //---------->>  This does have an error!!
    }

})

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)

}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === 'edit'){
                params.errorMessage = 'Error Updating Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('/books')
    }
}

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}


// Show book route
router.get('/:id', async (req,res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book})
    } catch {
        res.redirect('/')
    }
})

// Edit book route
router.get('/:id/edit', async (req, res) => {

    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        res.redirect('/')   
    }

})

// Update book route
router.put('/:id', upload.single('cover'), async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount= req.body.pageCount
        book.description = req.body.description
        // if (req.body.cover != null && req.body.cover !== ''){
        //     saveCover(book, req.body.cover)
        // }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error) {
        console.log(error)
        if (book != null){
            renderEditPage(res, book, true)
        } else {
            redirect('/ ')
        }
    }

})

// Delete book route
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if(book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book.'
            })
        } else {
            res.redirect('/')
        }
    }
})




module.exports = router











// const date1 = new Date(req.query.publishedAfter).toISOString()
// console.log('Fiz search de publishedAfter: ' + date1)
// // query = query.gte('publishedDate', new Date(date1))

// // let meuBooks = Book.find({"publishDate": {"$gte": date1}  })
// let myBooks = Book.where('publishedAfter').gte(date1)

// console.log('Tamanho da query NOVA:' + myBooks.length)