const { Route, Routes, Navigate } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from "./cmps/AppHeader.jsx"
import { About } from "./pages/About.jsx"
import { Home } from "./pages/Home.jsx"
import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"
import { NoteIndex } from "./apps/note/pages/NoteIndex.jsx"
import { MailDetails } from "./apps/mail/cmps/MailDetails.jsx"


export function App() {
    return <Router>
        <section className="app">
            {/* <AppHeader /> */}
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mail/:status" element={<MailIndex />} />
                <Route path="/mail/:status/:mailId" element={<MailIndex />} />
                <Route path="/note" element={<NoteIndex />} />
            </Routes>
        </section>
    </Router>
}
