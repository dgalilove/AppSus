import { AddBooksList } from "../cmps/AddBooksList.jsx"
import { booksService } from "../js/services/books.service.js"
import { utilService } from "../js/services/util.service.js"


const { useState, useEffect, useRef } = React

export function BookAdd() {

    const [addBookList, setAddBookList] = useState('')

    const onSearchBookDebounce = useRef(utilService.debounce(handleChange)).current

    function handleChange({ target }) {

        let value = target.value
        if (!value.trim()) {
            setAddBookList('')
            return
        }
        booksService.getGoogleBooks(value)
            .then(books => {
                setAddBookList(books)
            })
            .catch(err => {
                console.log(err)
            })
    }



    return (
        <section className="book-add">
            <input onChange={onSearchBookDebounce}
                placeholder='Search for a book'
                type="search" name="" id="" />
            {addBookList && <AddBooksList addBooksList={addBookList} />}
        </section>
    )
}