const { Link } = ReactRouterDOM

import { BookPreview } from "./BookPreview.jsx"

export function BookList({ books }) {

    if (!books) return <div>Loading...</div>
    return (
        <section className="book-list">
            <ul>
                {books.map(book => {
                    return (
                        <li key={book.id}>
                            <BookPreview book={book} />
                            {book.listPrice.isOnSale && <h6>on sale</h6>}

                            <div className='info'>
                                <h4>{book.listPrice.amount} {book.listPrice.currencyCode}</h4>
                                <h5>{book.authors}</h5>
                            </div>
                            <div className='rest-data'>
                                <img src={book.thumbnail} alt="Book cover" />
                                <div className='buttons'>
                                    <Link to={`/books/${book.id}`}>Details</Link>
                                    <Link to={`/books/edit/${book.id}`}>Edit</Link>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}