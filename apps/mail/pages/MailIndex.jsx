import { MailList } from "../cmps/MailList.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [mails, setMails] = useState('')
    const [filterBy, setFilterBy] = useState({})

    useEffect(() => {
        loadMails()
    }, [])

    function loadMails() {
        mailService.query(filterBy)
            .then(mails => {
                setMails(mails)
                console.log(mails)
            })
            .catch(err => console.log(err))

    }

    if (!mails) return <div>Loading...</div>
    return <div className="main-index">
        <MailList mailList={mails} />
    </div>
}

