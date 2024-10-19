const { useState } = React
import{showSuccessMsg} from '/Users/Daniel/Desktop/AppSus/services/event-bus.service.js'

import { RateCmp } from "./RateCmp.jsx"
import { booksService } from '/Users/Daniel/Desktop/AppSus/services/books.service.js'


export function AddReview({ bookId, setReviews }) {

    const [bookReview, setBookReview] = useState({ fullname: '', rating: '1', readAt: '', review: '' })
    const [cmpType, setCmpType] = useState()

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }

        setBookReview(prevReview => ({ ...prevReview, [field]: value }))
    }

    function handleRatingChange(newValue) {
        const field = 'rating'
        let value = newValue
        setBookReview(prevReview => ({ ...prevReview, [field]: value }))
    }


    function onSaveReview(ev) {
        ev.preventDefault()
        booksService.addReview(bookId, bookReview)
            .then(book => {
                booksService.save(book)
                    .then(book => {
                        console.log('Review Saved')
                        setReviews(bookReview)
                        showSuccessMsg('Review saved successfully')

                    })
                    .catch(err => {
                        console.log('err:', err)
                    })

            })

    }

    return (
        <section className="add-review">
            <h2>Add review</h2>
            <form onSubmit={onSaveReview}>
                <div className='book-review-info-row'>
                    <label className='book-review-info-title'>FullName:</label>
                    <input
                        type='text'
                        placeholder='FullName'
                        name='fullname'
                        onChange={handleChange}
                        required={true}
                    />
                </div>

                <fieldset>
                    <legend>Select a rate option:</legend>

                    <div>
                        <input required type="radio" id="select" name="rate-option" value="select" onChange={() => setCmpType('select')} />
                        <label htmlFor="select">Select</label>
                    </div>

                    <div>
                        <input type="radio" id="textbox" name="rate-option" value="textbox" onChange={() => setCmpType('textbox')} />
                        <label htmlFor="textbox">Textbox</label>
                    </div>

                    <div>
                        <input type="radio" id="stars" name="rate-option" value="stars" onChange={() => setCmpType('stars')} />
                        <label htmlFor="stars">Stars</label>
                    </div>
                </fieldset>

                <div className='book-review-info-row'>
                    <RateCmp cmpType={cmpType} onChange={handleChange} handleRatingChange={handleRatingChange} rating={bookReview.rating} />
                </div>

                <div className='book-review-info-row'>
                    <label className='book-review-info-title'>Read At:</label>
                    <input
                        type='date'
                        name='readAt'
                        onChange={handleChange}
                        required={true}

                    />
                </div>

                <div className='book-review-info-row'>
                    <label className='book-review-info-title'>review:</label>
                    <textarea
                        type='text'
                        name='review'
                        onChange={handleChange}
                        required={true}

                    />
                </div>

                <button>Save</button>

            </form>
        </section>
    )
}