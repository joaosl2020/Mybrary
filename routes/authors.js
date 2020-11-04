const express = require('express')
const author = require('../models/author')
const router = express.Router()

const Author = require('../models/author')

// All authors route
// Todas as routes /authors já têm o prefixo /authors

router.get('/', async (req,res) => {
    let searchOptions = {}
    // Precisamos usar req.query e nao req.body pq estamos
    // pedindo pelo GET e nao POST
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

module.exports = router