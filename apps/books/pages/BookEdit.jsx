const { useNavigate, useParams } = ReactRouterDOM
import { showErrorMsg, showSuccessMsg } from "../js/services/event-bus.service.js"



import { booksService } from "../js/services/books.service.js"

const { useState, useEffect } = React

export function BookEdit() {

    const [bookToEdit, setBookToEdit] = useState('')
    const navigate = useNavigate()
    const { bookId } = useParams()

    useEffect(() => {
        if (bookId) loadBook()
    }, [])


    function loadBook() {
        booksService.get(bookId)
            .then(setBookToEdit)
    }


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

        setBookToEdit(prevBook => ({ ...prevBook, [field]: value }))
    }

    function handleListPriceChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setBookToEdit((prevBook) => ({ ...prevBook, listPrice: { ...bookToEdit.listPrice, [field]: value } }))
    }

    function onSaveBook(ev) {
        ev.preventDefault()
        booksService.save(bookToEdit)
            .then(book => {
                console.log('Book Saved')
                showSuccessMsg('Book saved successfully')

            })
            .catch(err => {
                console.log('err:', err)
            })
            .finally(() => {
                navigate('/books')
            })
    }


    if (!bookToEdit) return <div></div>


    return (
        <section className='book-edit'>
            <h2 className='edit-book-header'>Edit Book</h2>
            <form onSubmit={onSaveBook}>
                <div className='book-details-info-row'>
                    <label className='book-details-info-title'>Title:</label>
                    <input
                        type='text'
                        placeholder='Enter New Title'
                        name='title'
                        value={bookToEdit.title}
                        onChange={handleChange}
                    />
                </div>

                <div className='book-details-info-row'>
                    <label className='book-details-info-title'>Description:</label>
                    <textarea
                        type='text'
                        placeholder='Enter New Description'
                        name='description'
                        value={bookToEdit.description}
                        onChange={handleChange}
                    />
                </div>

                <div className='book-details-info-row'>
                    <label className='book-details-info-title'>Price:</label>
                    <input
                        type='number'
                        placeholder='Set Price'
                        name='amount'
                        onChange={handleListPriceChange}
                        value={bookToEdit.listPrice.amount}
                    />
                </div>

                <div className='book-details-info-row'>
                    <label className='book-details-info-title'>On Sale:</label>
                    <input
                        type='checkbox'
                        placeholder='Set Price'
                        name='isOnSale'
                        onChange={handleListPriceChange}
                        checked={bookToEdit.listPrice.isOnSale}
                    />
                </div>

                <button>Save</button>

            </form>
        </section >
    )
}



