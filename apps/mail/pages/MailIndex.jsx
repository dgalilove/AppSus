import { AppNavigator } from "../../../cmps/AppNavigator.jsx"
import { utilService } from "../../../services/util.service.js"
import { MailDetails } from "../cmps/MailDetails.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { NewCompose } from "../cmps/NewCompse.jsx"
import { SearchBar } from "../cmps/SearchBar.jsx"
import { SideBar } from "../cmps/SideBar.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useSearchParams, useParams, useNavigate } = ReactRouterDOM





export function MailIndex() {

    const [mails, setMails] = useState('')
    const [unreadMails, setUnreadMails] = useState('')
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [isHidden, setIsHidden] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = mailService.getFilterFromSearchParams(searchParams)
    const [filterBy, setFilterBy] = useState(defaultFilter)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()


    const { mailId } = useParams()
    const { status } = useParams()


    useEffect(() => {
        if (!status) status = 'inbox'
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, sort: 'date' }))

    }, [])

    useEffect(() => {
        setSearchParams(utilService.getTruthyValues(filterBy))
        if (filterBy.compose === 'new') {
            setIsComposeOpen(filterBy.compose)
        } else {
            setIsComposeOpen(false)
        }
        loadMails()
    }, [filterBy])


    useEffect(() => {
        loadMails()
        if (!filterBy.sort) {
            setFilterBy(prevFilterBy => ({ ...prevFilterBy, sort: 'date' }))
        }
    }, [status])



    function loadMails() {

        mailService.query(filterBy, status)
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

    function onBurgerMenu() {
        setIsOpen(!isOpen)
    }

    function onLogo() {
        navigate('/mail/inbox')
    }

    const isOpenClass = isOpen ? 'open' : ''

    return <div className="mail-index">
        <div className="mail-index-header">
            <div className="burger-and-logo">
                <svg onClick={onBurgerMenu} className={`burger ${isOpenClass}`} xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
                <img onClick={onLogo} className="gmail" src="/assets/css/apps/mail/mail-svgs/Gmail-with-Text.svg" alt="" />
            </div>
            <SearchBar onSetFilterBy={onSetFilterBy} filterBy={filterBy} />

            <div className="dots-and-account">
                <div className="navigator-container">
                    <img onClick={() => setIsHidden(!isHidden)} className="dots" src="/assets/css/apps/mail/mail-svgs/dot-library.svg" alt="" />
                    <AppNavigator isHidden={isHidden} />
                </div>
                <img className="account-logo" src="/assets/css/apps/mail/mail-svgs/account-logo.jpeg" alt="" />

            </div>
        </div>
        <div className="mail-index-body">
            <SideBar unreadMails={unreadMails} openCompose={openCompose} onSetFilterBy={onSetFilterBy} filterBy={filterBy} isOpen={isOpen} />
            {mailId && status !== 'draft' ? <MailDetails /> : <MailList mailList={mails} onSetFilterBy={onSetFilterBy} onRemoveMail={onRemoveMail} filterBy={filterBy} openCompose={openCompose} />}
            {isComposeOpen && <NewCompose onSetFilterBy={onSetFilterBy} closeCompose={closeCompose} filterBy={filterBy} />}

        </div>


    </div>
}

