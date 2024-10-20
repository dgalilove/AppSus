import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { mailService } from "../services/mail.service.js"

const { useParams, useNavigate, Link } = ReactRouterDOM
const { useState, useEffect } = React

export function MailDetails({ setIsMobileHeaderHidden, onRemoveMail, onSetFilterBy }) {

    const [mail, setMail] = useState(null)
    const { mailId } = useParams()
    const navigate = useNavigate()
    const { status } = useParams()

    useEffect(() => {
        mailService.get(mailId)
            .then(mail => {
                setMail(mail)
                showSuccessMsg(`Mail {${mailId}} details opened`)
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(`Cannot open {${mailId}} details`)

            })
    }, [mailId])

    useEffect(() => {
        mailService.get(mailId)
            .then(mail => {
                setMail(mail)
            })
            .catch(err => {
                console.log(err)
            })
    }, [mail])



    function onBack() {
        navigate(`/mail/${status}`)
        setIsMobileHeaderHidden(false)
    }

    function onOpenNewWindow() {
        const url = `#/mail/${status}/${mailId}`;
        window.open(url, '_blank');
    }

    function onCrateNote() {
        navigate({
            pathname: '/note',
            search: `?title=${mail.subject}&txt=${mail.body}`
        })
    }

    function onMailReadMark(ev, mailId) {
        ev.stopPropagation()
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isRead: !mail.isRead }
                mailService.save(mail)
                    .then(mails => {
                        onSetFilterBy(prev => ({ ...prev }))
                    })

            })
    }


    function onRemove(ev, mailId) {
        ev.stopPropagation()
        onRemoveMail(mailId)
        navigate(`/mail/${status}`)
    }


    if (!mail) return <div>Loading...</div>

    const { subject, body, from, sentAt, name } = mail
    const date = new Date(sentAt).toString().split(' ')
    return (
        <div className="mail-details">
            <div className="tool-bar">
                <button title='Back' onClick={onBack} ><i className="fa-solid fa-arrow-left"></i></button>
                <button title='Open in new window' onClick={onOpenNewWindow}><i className="fa-solid fa-up-right-from-square"></i></button>
                <button title='Convert mail to note' onClick={onCrateNote}><i className="fa-solid fa-notes-medical"></i></button>
                <button title='Remove' onClick={(event) => onRemove(event, mail.id)}> <i className="fa-regular fa-trash-can" ></i></button>
                {mail.isRead ?
                    <button title='Check as read' onClick={(event) => onMailReadMark(event, mail.id)}><i className="fa-regular fa-envelope" ></i></button>
                    : <button title='Check as unread' onClick={(event) => onMailReadMark(event, mail.id)}> <i className="fa-regular fa-envelope-open"></i></button>}


            </div>

            <div className="body-details">
                <div className="header">
                    <h2>{subject}</h2>

                </div>
                <div className="sender-details">
                    <img src={`https://robohash.org/${mailId}`} alt="" />
                    <div className="information">
                        <h3 className="name">{name}</h3>
                        <p className="from">{`<${from}>`}</p>
                        <p className="date">{`${date[1]} ${date[2]}, ${date[3]}, ${date[4]}`}</p>
                    </div>
                </div>
                <pre>{body}</pre>
            </div>

        </div>

    )
}