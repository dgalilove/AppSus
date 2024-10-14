import { MailList } from "../cmps/MailList.jsx"
import { SideBar } from "../cmps/SideBar.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [mails, setMails] = useState('')
    const [filterBy, setFilterBy] = useState({})

    useEffect(() => {
        loadMails()
    }, [mails])

    function loadMails() {

        mailService.query(filterBy)
            .then(mails => {
                setMails(mails)
            })
            .catch(err => console.log(err))
    }

    return <div className="mail-index">
        <SideBar />
        <MailList mailList={mails} />
    </div>
}

