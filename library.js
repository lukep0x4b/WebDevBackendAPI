export class Library{
    async getBooks(){
        throw new Error("Implement getBooks")
    }

    async getBook(id){
        throw new Error("Implement getBook")
    }

    async addBook(book){
        throw new Error("Implement addBook")
    }

    async updateBook(book){
        throw new Error("Implement updateBook")
    }

    async deleteBook(id){
        throw new Error("Implement deleteBook")
    }

    async destroy(){
        // optional destroy function for libraries that need it
    }
}