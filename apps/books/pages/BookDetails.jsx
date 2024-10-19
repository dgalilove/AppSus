const { useParams, useNavigate, Link } = ReactRouterDOM

import { AddReview } from '../cmps/AddReview.jsx'
import { LongTxt } from '../cmps/LongTxt.jsx'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { booksService } from '../js/services/books.service.js'

const { useState, useEffect } = React

export function BookDetails() {
    const [book, setBook] = useState(null)
    const [reviews, setReviews] = useState(null)
    const { bookId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        booksService.get(bookId).then((book) => {
            setBook(book)
            setReviews(book.reviews || [])
        })
    }, [bookId])

    function updateReviews(review) {
        setReviews((prevReviews) => [...prevReviews, review])
    }

    function onBack() {
        navigate('/books')
    }

    if (!book) return <div>Loading...</div>

    const { title, subtitle, listPrice, authors,  thumbnail, pageCount, publishedDate } = book
    console.log(book)
    function getPageCountText() {
        if (pageCount > 500) return 'Serious Reading'
        if (pageCount > 200) return 'Descent Reading'
        if (pageCount < 100) return 'Light Reading'
    }

    function getPublishDateText() {
        const date = new Date()
        if (date.getFullYear() - publishedDate > 10) return 'Vintage'
        if (date.getFullYear() - publishedDate < 1) return 'New'
    }

    function getPriceColor() {
        if (listPrice.amount > 150) return 'red'
        if (listPrice.amount < 20) return 'green'
    }

    const pageCountText = getPageCountText()
    const publishDateText = getPublishDateText()
    const pricedColor = getPriceColor()
    return (
        <section className="book-details">
            <h2>
                {title} [{publishDateText}]
            </h2>
            <h3>{subtitle}</h3>
            {listPrice.isOnSale && <h6>The book is on sale</h6>}
            <div className="info">
                <h4 className={pricedColor}>
                    {listPrice.currencyCode} {listPrice.amount}{' '}
                </h4>
                <h5>{authors}</h5>
            </div>

            {/* <LongTxt txt={description} /> */}
            <div className="img-and-rev">
                <img src={thumbnail} alt="Book cover" />
                <AddReview bookId={book.id} setReviews={updateReviews} />
            </div>
            <p>
                Pages : {pageCount} {pageCountText}
            </p>
            <button onClick={onBack}>Back</button>
            <section>
                <Link to={`/books/${book.prevBookId}`}>Prev Book</Link>
                <Link to={`/books/${book.nextBookId}`}>Next Book</Link>
            </section>
            {reviews && <ReviewList reviews={reviews} />}
        </section>
    )
}
