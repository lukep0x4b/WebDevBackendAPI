const TABLE = document.getElementById("table")
const CREATE_BUTTON = document.getElementById("create")

function createBookEntry(book){
    const tr = document.createElement("tr")
    const thName = document.createElement("th")
    thName.textContent = book.Name
    tr.appendChild(thName)
    const thAuthor = document.createElement("th")
    thAuthor.textContent = book.Author
    tr.appendChild(thAuthor)
    const thActions = document.createElement("th")
    const updateButton = document.createElement("button")
    updateButton.textContent = "Update"
    updateButton.addEventListener("click", async () => {
        const name = prompt("Book name:", book.Name)
        if (name === null) return
        const author = prompt("Author:", book.Author)
        if (author === null) return
        if (!name.trim() || !author.trim()) {
            alert("Both name and author are required")
            return
        }
        const res = await fetch(`/book/${book.Id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim(), author: author.trim() })
        })
        const data = await res.json()
        if (res.ok) {
            alert(data.Message ?? "Book updated")
        } else {
            alert(data.Message ?? "Update failed")
        }
        await refreshEntries()
    })
    thActions.appendChild(updateButton)
    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener("click", async () => {
        if (!confirm(`Delete "${book.Name}" by ${book.Author}?`)) return
        const res = await fetch(`/book/${book.Id}`, { method: "DELETE" })
        const data = await res.json()
        if (res.ok) {
            tr.remove()
            alert(data.Message ?? "Book removed")
        } else {
            alert(data.Message ?? "Delete failed")
        }
        await refreshEntries()
    })
    thActions.appendChild(deleteButton)
    tr.appendChild(thActions)
    TABLE.appendChild(tr)
}

async function refreshEntries(){
    // clear old rows
    TABLE.querySelectorAll("tr:nth-child(n+2)").forEach(tr => tr.remove())
    try{
        // fetch the new ones
        let json = await (await fetch("/books")).json()
        let books = json.Result
        for(let i = 0; i < books.length; i++){
            createBookEntry(books[i])
        }
    } catch(e){
        console.error(e)
        console.warn("Failed to fetch books! Retying in 15 seconds...")
        window.setTimeout(async () => {
            await refreshEntries()
        }, 15000)
    }
}

CREATE_BUTTON.addEventListener("click", async () => {
    const name = prompt("Book name:")
    if (name === null) return
    const author = prompt("Author:")
    if (author === null) return
    if (!name.trim() || !author.trim()) {
        alert("Both name and author are required")
        return
    }
    const res = await fetch("/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), author: author.trim() })
    })
    const data = await res.json()
    if (res.ok) {
        alert(data.Message ?? "Book added")
    } else {
        alert(data.Message ?? "Could not add book")
    }
    await refreshEntries()
});
// ^ the one time a semicolon is actually required

(async () => {await refreshEntries()})()