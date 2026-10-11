import { Book } from "./book.js"
import * as Messages from "./message.js"
import { MongoLibrary } from "./libraries/mongo.js"

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import path from "path"
import http from "http"
import dotenv from "dotenv"

// read .env file
dotenv.config()

const library = new MongoLibrary(process.env.MONGODB_URI)

const app = express()
// url parameters
app.use(bodyParser.urlencoded({extended: true}))
// json bodies
app.use(bodyParser.json())
// https://media.tigers.gay/image/iiDD
app.use(cors())
// web directory
app.use(express.static(path.join(import.meta.dirname, "www")))

app.get("/books", async (req, res) => {
    res.end(Messages.Response(true, "Got library", await library.getBooks()))
})

app.get("/book/:id", async (req, res) => {
    let id = req.params.id
    let book = await library.getBook(id)
    if(book === undefined){
        res.status(404)
        res.end(Messages.Response(false, "Book does not exist"))
        return
    }
    res.end(Messages.Response(true, "Got book from library", book))
})

app.post("/book", async (req, res) => {
    let name = req.body.name
    let author = req.body.author
    const b = new Book(name, author)
    await library.addBook(b)
    res.status(201)
    res.end(Messages.Response(true, "Added book to library", {
        Id: b.id
    }))
})

app.put("/book/:id", async (req, res) => {
    let id = req.params.id
    let name = req.body.name
    let author = req.body.author
    const b = new Book(name, author, id)
    const r = await library.updateBook(b)
    if(r){
        res.end(Messages.Response(true, "Updated book in library"))
        return
    }
    res.status(404)
    res.end(Messages.Response(false, "Book does not exist"))
})

app.delete("/book/:id", async (req, res) => {
    let id = req.params.id
    await library.deleteBook(id)
    res.end(Messages.Response(true, "If the book exists in the library, it was removed"))
})

const server = http.createServer(app)
server.listen(8008)
console.log("Server started on :8008/")