import { MongoClient } from "mongodb"
import { Library } from "../library.js"

export class MongoLibrary extends Library {
    constructor(uri, dbName = "library", collectionName = "books") {
        super()
        this.client = new MongoClient(uri)
        this.dbName = dbName
        this.collectionName = collectionName
        this.collection = null
        this.connected = false
    }

    async connect() {
        if (this.connected) return
        await this.client.connect()
        this.collection = this.client.db(this.dbName).collection(this.collectionName)
        // index by Id
        await this.collection.createIndex({ Id: 1 }, { unique: true })
        this.connected = true
        console.log("Started Mongo Library")
    }

    async getBooks() {
        await this.connect()
        // get all books and exclude internals
        return await this.collection.find({}, { projection: { _id: 0 } }).toArray()
    }

    async getBook(id) {
        await this.connect()
        return await this.collection.findOne({ Id: id }, { projection: { _id: 0 } })
    }

    async addBook(book) {
        await this.connect()
        if ((await this.getBook(book.id)) !== null) return false
        try {
            await this.collection.insertOne(book.toJson())
            return true
        } catch (err) {
            // duplicate key
            console.error(err)
            if (err.code === 11000) return false
            throw err
        }
    }

    async updateBook(book) {
        await this.connect()
        const result = await this.collection.updateOne(
            { Id: book.id },
            { $set: { Name: book.name, Author: book.author } }
        )
        return result.matchedCount > 0
    }

    async deleteBook(id) {
        await this.connect()
        await this.collection.deleteOne({ Id: id })
    }

    async destroy() {
        await this.client.close()
        console.log("Goodbye, mongo!")
    }
}