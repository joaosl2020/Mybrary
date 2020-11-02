const mongoose = require('mongoose')

//schema é como se fosse uma table (para NoSQL)
// Dentro do mongoose.Schema, se definem as columns
// A 'name' é uma column, de tipo String e required.
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// O 'Author' abaixo é o nome da table
// Em seguida, passamos o schema que define a table exportada
module.exports = mongoose.model('Author', authorSchema)