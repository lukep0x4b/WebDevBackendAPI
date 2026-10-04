import { Library } from "../library.js"

export class MemoryLibrary extends Library{
    constructor(){
        super()
        this.books = []
    }

    getBooks(){
        return this.books
    }

    getBook(id){
        let b
        for(let i = 0; i < this.books.length; i++){
            b = this.books[i]
            if(b.Id === id) return b
        }
        return undefined
    }

    addBook(book){
        // book already exists
        if(this.getBook(book.id) !== undefined) return false
        this.books.push(book.toJson())
        return true
    }
    
    updateBook(book){
        for(let i = 0; i < this.books.length; i++){
            let compareBook = this.books[i]
            if(compareBook.Id === book.id){
                this.books[i].Name = book.name
                this.books[i].Author = book.author
                return true
            }
        }
        return false
    }

    deleteBook(id){
        this.books = this.books.filter(book => book.Id !== id)
    }
}