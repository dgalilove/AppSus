import { storageService } from './async-storage.service.js'
import { booksList } from './books.js'
import { utilService } from './util.service.js'

const BOOKS_KEY = 'booksDB'

_createBooks()

export const booksService = {
    query,
    get,
    getDefaultFilterBy,
    save,
    addReview,
    getGoogleBooks,
    addGoogleBook,
    getFilterFromSearchParams,
}

function query(filterBy = {}) {
    return storageService.query(BOOKS_KEY).then((books) => {
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            books = books.filter((book) => regExp.test(book.title))
        }
        if (filterBy.minPrice) {
            books = books.filter((book) => book.listPrice.amount >= filterBy.minPrice)
        }
        return books
    })
}

function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const minPrice = searchParams.get('minPrice') || ''
    return {
        txt,
        minPrice,
    }
}

function get(bookId) {
    return storageService.get(BOOKS_KEY, bookId).then(_setNextPrevBookId)
}



function save(book, isGoogleBook = false) {
    if (book.id && !isGoogleBook) {
        book.updatedAt = Date.now()
        return storageService.put(BOOKS_KEY, book, isGoogleBook)
    } else {
        book.createdAt = book.updatedAt = Date.now()
        return storageService.post(BOOKS_KEY, book)
    }
}

function createReview({ fullname, rating, readAt, review }) {
    const newReview = {
        id: utilService.makeId(),
        fullname,
        rating,
        readAt,
        review,
    }
    return newReview
}

function getGoogleBooks(subject) {
    console.log(subject)
    const url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=${encodeURIComponent(subject)}`
    return axios
        .get(url)
        .then((res) => {
            console.log(res.data.items)
            return res.data.items
        })
        .catch((err) => err)
}

function addGoogleBook(googleBook) {
    return query()
        .then((books) => {
            if (books.some((book) => book.id === googleBook.id)) {
                return Promise.reject('Book already exists')
            }
            return books
        })
        .then((books) => {
            const book = _formatGoogleBook(googleBook)
            const isGoogleBook = true
            return save(book, isGoogleBook)
        })
}

function _formatGoogleBook(googleBook) {
    const { volumeInfo } = googleBook
    console.log(googleBook)
    const book = {
        id: googleBook.id || '',
        title: volumeInfo.title,
        subtitle: volumeInfo.subtitle || '',
        authors: volumeInfo.authors || [],
        publishedDate: volumeInfo.publishedDate || '',
        description: volumeInfo.description || '',
        pageCount: volumeInfo.pageCount || 0,
        categories: volumeInfo.categories || [],
        language: volumeInfo.language || '',
        thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : '',
        listPrice: {
            amount: 100,
            currencyCode: 'EUR',
            isOnSale: false,
        },
    }

    return book
}

function addReview(bookId, review) {
    return get(bookId).then((book) => {
        if (!book.reviews) book.reviews = []
        book.reviews = [...book.reviews, createReview(review)]
        return book
    })
}

function getDefaultFilterBy() {
    return { txt: '', minPrice: '' }
}

function _setNextPrevBookId(book) {
    return query().then((books) => {
        const bookIdx = books.findIndex((currBook) => currBook.id === book.id)
        const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0]
        const prevBook = books[bookIdx - 1] ? books[bookIdx - 1] : books[books.length - 1]
        book.nextBookId = nextBook.id
        book.prevBookId = prevBook.id
        return book
    })
}

function _createBooks() {
    let books = utilService.loadFromStorage(BOOKS_KEY)
    if (!books || !books.length) {
        books = booksList.query()
        console.log(books)
        utilService.saveToStorage(BOOKS_KEY, books)
    }
}
