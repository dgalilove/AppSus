import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { BookDetails } from "./BookDetails.jsx"
import { utilService } from "../../../services/util.service.js"
import { booksService } from "../../../services/books.service.js"
const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function BooksIndex() {

    const [books, setBooks] = useState(null)
    const [selectedBookId, setSelectedBookId] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState({})

    useEffect(() => {
        setSearchParams(utilService.getTruthyValues(filterBy))
        loadBooks()
    }, [filterBy])

    function loadBooks() {
        booksService.query(filterBy)
            .then(books => setBooks(books))
            .catch(err => console.log(err))
    }

    function onSelectBookId(bookId) {
        setSelectedBookId(bookId)
    }

    function onSetFilterBy(filterByToEdit) {
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...filterByToEdit }))
    }

    return (
        <section className="books-index books-layout">
            {!selectedBookId ?
                <React.Fragment>
                    <BookFilter onSetFilterBy={onSetFilterBy} filterBy={filterBy} />
                    <Link to='/books/Add'>Search for a book</Link>
                    <BookList onSelectBookId={onSelectBookId} books={books} />
                </React.Fragment>
                : <BookDetails onBack={() => setSelectedBookId(null)} bookId={selectedBookId} />
            }
        </section>
    )
}