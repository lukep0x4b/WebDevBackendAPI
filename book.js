import { v4 as uuidv4 } from 'uuid'

export class Book{
    constructor(name, author, id){
        this.id = uuidv4();
        this.name = name
        this.author = author
        if(id !== undefined) this.id = id
    }

    toJson(){
        return {
            Id: this.id,
            Name: this.name,
            Author: this.author
        }
    }
}