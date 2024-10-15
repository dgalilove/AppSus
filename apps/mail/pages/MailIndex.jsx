import { utilService } from "../../../services/util.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { NewCompose } from "../cmps/NewCompse.jsx"
import { SearchBar } from "../cmps/SearchBar.jsx"
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
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, status: 'inbox', sort: 'date' }))
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
        <div className="mail-index-header">
            <div className="burger-and-logo">
                <svg className="burger" xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
                <img className="gmail" src="/assets/css/apps/mail/mail-svgs/Gmail-with-Text.svg" alt="" />
            </div>
            <SearchBar onSetFilterBy={onSetFilterBy} filterBy={filterBy} />

            <div className="dots-and-account">
                <img className="dots" src="/assets/css/apps/mail/mail-svgs/dot-library.svg" alt="" />
                <img className="account-logo" src="/assets/css/apps/mail/mail-svgs/account-logo.jpeg" alt="" />

            </div>
        </div>
        <div className="mail-index-body">
            <SideBar unreadMails={unreadMails} openCompose={openCompose} onSetFilterBy={onSetFilterBy} />
            <MailList mailList={mails} onSetFilterBy={onSetFilterBy} onRemoveMail={onRemoveMail} filterBy={filterBy} />
            {isComposeOpen && <NewCompose onSetFilterBy={onSetFilterBy} closeCompose={closeCompose} filterBy={filterBy} />}

        </div>

    </div>
}

