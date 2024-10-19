import { booksService } from "/Users/Daniel/Desktop/AppSus/services/books.service"

const { useNavigate } = ReactRouterDOM

export function AddBooksList({ addBooksList }) {

    if (!addBooksList) return <div>Loading..</div>

    const navigate = useNavigate()


    function onAddBook(book) {
        booksService.addGoogleBook(book)
            .then(res => {
                navigate('/books')
            })

    }
    return (
        <section className="add-books-list">
            <ul>
                {addBooksList.map((book, idx) => {
                    const { volumeInfo } = book
                    return (
                        <li key={idx}>
                            Title: {volumeInfo.title} by :{volumeInfo.authors}
                            <button onClick={() => onAddBook(book)}>+</button>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}