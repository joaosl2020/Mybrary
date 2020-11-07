const express = require('express')
const author = require('../models/author')
const router = express.Router()

const Author = require('../models/author')
const Book = require('../models/book')

// All authors route

router.get('/', async (req,res) => {
    let searchOptions = {}

    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            autores: authors, 
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New author route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() } )
})

// Create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    } catch {
        // let locals = { author: author, errorMessage: "Something went wrong :(" }
        res.render('authors/new', { author: author, errorMessage: "Something went wrong :(" })
    }

  {  
      // author.save((err, newAuthor) => {
    //     if (err){
    //         // let locals = { author: author, errorMessage: "Something went wrong :(" }
    //         // res.render('authors/new', { author: author, errorMessage: 'Error creating Author'})
    //         res.render('authors/new', { author: author, errorMessage: "Something went wrong :(" })
    //     } else {
    //         // res.redirect(`authors/${newAuthor.id}`)
    //         res.redirect(`authors`)
    //     }
    // })
  }
})









// Specific Author Route

router.get('/:id', async (req, res) =>{
    try {
        const author = await Author.findById(req.params.id)
        const books =  await Book.find({ author: author.id })
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (error){
        console.log(error)
        res.redirect('/')
    }
})
router.get('/:id/edit', async (req, res) =>{
    try {
        const localAuthor = await Author.find({ _id: req.params.id})
        const authorsBooks = await Book.find({ author: req.params.id})
        console.log('Encontrei livros do autor em questao: ' + authorsBooks.length)
        res.render('authors/edit', { author: localAuthor[0], authorsBooks: authorsBooks})
    } catch {
        console.log('deu ruim')
        res.render('authors/new', { errorMessage: "Error finding author!!"})  // ---> eu que fiz, revisar dps      
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
    // const result = await Author.updateOne({_id: req.params.id}, {$set : { "name": req.body.newName}}).limit(1)
      author = await Author.findById(req.params.id)
      author.name = req.body.name //AQUI
      await author.save()
      res.redirect(`/authors/${author.id}`)
    } catch (error) {
      if (author == null) {
        res.redirect('/')
      } else {
        res.render('authors/edit', {
          author: author,
          errorMessage: 'Error updating Author'
        })
      }
    }
  })

router.delete('/:id', async (req, res) =>{
    let author
    try {
    // const result = await Author.updateOne({_id: req.params.id}, {$set : { "name": req.body.newName}}).limit(1)
      author = await Author.findById(req.params.id)
      await author.remove() 
      res.redirect(`/authors`)
    } catch (error) {
      if (author == null) {
        res.redirect('/')
      } else {
        res.redirect(`/authors/${author.id}`)
      }
    }
})


module.exports = router