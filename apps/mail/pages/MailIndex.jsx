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
    const [isMobileHeaderHidden, setIsMobileHeaderHidden] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = mailService.getFilterFromSearchParams(searchParams)
    const [filterBy, setFilterBy] = useState(defaultFilter)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const [isMobileSideBarOpen, setIsMobileSideBarOpen] = useState(false)
    const [isMobileBackDrop, setIsMobileBackDrop] = useState(false)


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
        setIsMobileSideBarOpen(true)
        setIsMobileBackDrop(true)
    }

    function onLogo() {
        navigate('/mail/inbox')
    }

    function onMobileBackDrop() {
        setIsMobileSideBarOpen(false)
        setIsMobileBackDrop(false)
    }

    const isOpenClass = isOpen ? 'open' : ''
    const mobileHeaderHiddenClass = isMobileHeaderHidden ? 'hidden' : ''
    const isMobileBackDropClass = isMobileBackDrop ? 'open' : ''

    function onClickPage(page) {
        if (page === 'gmail') {
            navigate('/mail/inbox')
        }
        else if (page === 'note') {
            navigate('/note')
        } else if (page === 'books') {
            navigate('/books')
        } else {
            navigate('/home')
        }
    }

    return <div className={`mail-index`}>
        <div className='mobile-navigator'>
            <i onClick={() => onClickPage('home')} class="fa-solid fa-house"></i>
            <i onClick={() => onClickPage('gmail')} class="fa-solid fa-at"></i>
            <i onClick={() => onClickPage('note')} class="fa-solid fa-pager"></i>
            <i onClick={() => onClickPage('books')} class="fa-solid fa-book"></i>
        </div>
        <div onClick={() => setIsComposeOpen(true)} className="new-compose-mobile"><i className="fa-solid fa-pencil"></i></div>
        <div onClick={onMobileBackDrop} className={`mobile-backdrop ${isMobileBackDropClass}`}></div>
        <div className={`mobile-header ${mobileHeaderHiddenClass}`}>
            <svg onClick={onBurgerMenu} className={`burger ${isOpenClass}`} xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
            <SearchBar onSetFilterBy={onSetFilterBy} filterBy={filterBy} />
            <img className="account-logo" src="/assets/css/apps/mail/mail-svgs/account-logo.jpeg" alt="" />
        </div>


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
            <SideBar setIsMobileBackDrop={setIsMobileBackDrop} setIsMobileSideBarOpen={setIsMobileSideBarOpen} isMobileSideBarOpen={isMobileSideBarOpen} unreadMails={unreadMails} openCompose={openCompose} isOpen={isOpen} />
            {mailId && status !== 'draft' ? <MailDetails setIsMobileHeaderHidden={setIsMobileHeaderHidden} /> : <MailList mailList={mails} onSetFilterBy={onSetFilterBy} onRemoveMail={onRemoveMail} filterBy={filterBy} openCompose={openCompose} setIsMobileHeaderHidden={setIsMobileHeaderHidden} />}
            {isComposeOpen && <NewCompose onSetFilterBy={onSetFilterBy} closeCompose={closeCompose} filterBy={filterBy} />}

        </div>


    </div>
}

