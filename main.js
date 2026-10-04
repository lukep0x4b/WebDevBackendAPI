import { Book } from "./book.js"
import * as Messages from "./message.js"
import { MemoryLibrary } from "./libraries/memory.js"

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import http from "http"

const library = new MemoryLibrary()

const app = express()
// url parameters
app.use(bodyParser.urlencoded({extended: true}))
// json bodies
app.use(bodyParser.json())
// https://media.tigers.gay/image/iiDD
app.use(cors())

app.get("/books", (req, res) => {
    res.end(Messages.Response(true, "Got library", library.getBooks()))
})

app.get("/book/:id", (req, res) => {
    let id = req.params.id
    let book = library.getBook(id)
    if(book === undefined){
        res.status(404)
        res.end(Messages.Response(false, "Book does not exist"))
        return
    }
    res.end(Messages.Response(true, "Got book from library", book))
})

app.post("/book", (req, res) => {
    let name = req.body.name
    let author = req.body.author
    const b = new Book(name, author)
    library.addBook(b)
    res.status(201)
    res.end(Messages.Response(true, "Added book to library", {
        Id: b.id
    }))
})

app.put("/book/:id", (req, res) => {
    let id = req.params.id
    let name = req.body.name
    let author = req.body.author
    const b = new Book(name, author, id)
    const r = library.updateBook(b)
    if(r){
        res.end(Messages.Response(true, "Updated book in library"))
        return
    }
    res.status(404)
    res.end(Messages.Response(false, "Book does not exist"))
})

app.delete("/book/:id", (req, res) => {
    let id = req.params.id
    library.deleteBook(id)
    res.end(Messages.Response(true, "If the book exists in the library, it was removed"))
})

const server = http.createServer(app)
server.listen(8008)
console.log("Server started on :8008/")