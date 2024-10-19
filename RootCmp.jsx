const { Route, Routes, Navigate } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { About } from "./pages/About.jsx"
import { Home } from "./pages/Home.jsx"
import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"
import { NoteIndex } from "./apps/note/pages/NoteIndex.jsx"
import { BooksIndex } from "./apps/books/pages/BooksIndex.jsx"
import { BookDetails } from "./apps/books/pages/BookDetails.jsx"
import { BookAdd } from "./apps/books/pages/BookAdd.jsx"
import { BookEdit } from "./apps/books/pages/BookEdit.jsx"

export function App() {
    return (
        <Router>
            <section className="app">
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/mail/:status" element={<MailIndex />} />
                    <Route path="/mail/:status/:mailId" element={<MailIndex />} />
                    <Route path="/note" element={<NoteIndex />} />
                    <Route path="/note/edit/:noteId" element={<NoteIndex />} />
                    {/* <Route path="/books" element={<BooksIndex />} />
          <Route path="/books/Add" element={<BookAdd />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/books/edit" element={<BookEdit />} />
          <Route path="/books/edit/:bookId" element={<BookEdit />} /> */}
                </Routes>
            </section>
        </Router>
    )
}
