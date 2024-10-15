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
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, status: 'inbox' }))
    }, [])

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

    function countUnreadMails() {
        mailService.query({ status: 'inbox' })
            .then(mails => {
                mails = mails.filter(mail => !mail.isRead)
                setUnreadMails(mails.length)
            })
            .catch(err => console.log(err))
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

    function onRemoveMail(mailId) {
        mailService.remove(mailId)
            .then(() => {
                setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
            })
            .catch(err => {
                console.log('err:', err)
            })
    }

    return <div className="mail-index">
        <SideBar unreadMails={unreadMails} openCompose={openCompose} onSetFilterBy={onSetFilterBy} />
        <MailList mailList={mails} onSetFilterBy={onSetFilterBy} onRemoveMail={onRemoveMail} />
        {isComposeOpen && <NewCompose onSetFilterBy={onSetFilterBy} closeCompose={closeCompose} filterBy={filterBy} />}

    </div>
}

