import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { BookDetails } from "./BookDetails.jsx"
import { utilService } from "../../../services/util.service.js"
import { booksService } from "../../../services/books.service.js"
import { AppNavigator } from "../../../cmps/AppNavigator.jsx"
const { useState, useEffect } = React
const { Link, useSearchParams, useNavigate } = ReactRouterDOM


export function BooksIndex() {

    const [books, setBooks] = useState(null)
    const [selectedBookId, setSelectedBookId] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState({})
    const [isHidden, setIsHidden] = useState(true)
    const navigate = useNavigate()


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


    function onClickPage(page) {
        if (page === 'gmail') {
            navigate('/mail/inbox')
        }
        else if (page === 'note') {
            navigate('/note')
        } else if (page === 'books') {
            navigate('/books')
        } else {
            navigate('/home')
        }
    }

    return (
        <section className="books-index books-layout">
            <div className='mobile-navigator'>
                <i onClick={() => onClickPage('home')} className={`fa-solid fa-house `}></i>
                <i onClick={() => onClickPage('gmail')} className={`fa-solid fa-at`}></i>
                <i onClick={() => onClickPage('note')} className="fa-solid fa-pager"></i>
                <i onClick={() => onClickPage('books')} className="fa-solid fa-book active"></i>
            </div>
            <div className="navigator-container">
                <img onClick={() => setIsHidden(!isHidden)} className="dots" src="./assets/css/apps/note/note-svgs/dot-library-light.svg" alt="" />
                <AppNavigator isHidden={isHidden} />
            </div>
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