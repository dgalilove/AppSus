import { utilService } from "../../../services/util.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { NewCompose } from "../cmps/NewCompse.jsx"
import { SideBar } from "../cmps/SideBar.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM


export function MailIndex() {

    const [mails, setMails] = useState('')
    const [unreadMails, setUnreadMails] = useState('')
    const [isComposeOpen, setIsComposeOpen] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = mailService.getFilterFromSearchParams(searchParams)
    const [filterBy, setFilterBy] = useState(defaultFilter)



    useEffect(() => {
        setSearchParams(utilService.getTruthyValues(filterBy))
        setIsComposeOpen(filterBy.compose)
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(mails => {
                setMails(mails)
                countUnreadMails(mails)
            })
            .catch(err => console.log(err))
    }

    function countUnreadMails(mails) {

        const unreadMails = mails.filter(mail => !mail.isRead)
        setUnreadMails(unreadMails.length)
        console.log(unreadMails.length)
    }

    function onSetFilterBy(filterByToEdit) {
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...filterByToEdit }))
    }

    function openCompose() {
        setIsComposeOpen(true)
        onSetFilterBy({ compose: 'new' })
    }

    function closeCompose() {
        setIsComposeOpen(false)
        onSetFilterBy({ compose: '', to: '', subject: '', body: '' })

    }

    return <div className="mail-index">
        <SideBar unreadMails={unreadMails} openCompose={openCompose} />
        <MailList mailList={mails} onSetFilterBy={onSetFilterBy} />
        {isComposeOpen && <NewCompose onSetFilterBy={onSetFilterBy} closeCompose={closeCompose} filterBy={filterBy} />}

    </div>
}

