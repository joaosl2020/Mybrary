const mongoose = require('mongoose')
const Book = require('./book')

//schema é como se fosse uma table (para NoSQL)
// Dentro do mongoose.Schema, se definem as columns
// A 'name' é uma column, de tipo String e required.
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next){
    // vai passar o next() a nao ser que passemos um ERROR ao next callback
    Book.find({ author: this.id }, (err, books) =>{
        if (err){
            next(err) // Isso previne que a funcao 'remove' seja completada
        } else if (books.length > 0){
            console.log('esse autor ainda tem livros')
            next(new Error('This author has books still!'))
        } else {
            next()
        }
    })
})

// O 'Author' abaixo é o nome da table
// Em seguida, passamos o schema que define a table exportada
module.exports = mongoose.model('Author', authorSchema)