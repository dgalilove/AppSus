import { MailList } from "../cmps/MailList.jsx"
import { NewCompose } from "../cmps/NewCompse.jsx"
import { SideBar } from "../cmps/SideBar.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [mails, setMails] = useState('')
    const [unreadMails, setUnreadMails] = useState('')
    const [filterBy, setFilterBy] = useState({})
    const [isComposeOpen, setIsComposeOpen] = useState(true)

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(mails => {
                setMails(mails)
                countUnreadMails()
            })
            .catch(err => console.log(err))
    }

    function countUnreadMails() {
        if (!mails) return
        const unreadMails = mails.filter(mail => !mail.isRead)
        setUnreadMails(unreadMails.length)
    }

    return <div className="mail-index">
        <SideBar unreadMails={unreadMails} />
        <MailList mailList={mails} />
        {isComposeOpen && <NewCompose />}
    </div>
}

