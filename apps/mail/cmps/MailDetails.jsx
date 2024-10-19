import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { mailService } from "../services/mail.service.js"

const { useParams, useNavigate, Link } = ReactRouterDOM
const { useState, useEffect } = React

export function MailDetails({ setIsMobileHeaderHidden }) {

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

    if (!mail) return <div>Loading...</div>

    const { subject, body, from, sentAt, name } = mail
    const date = new Date(sentAt).toString().split(' ')
    return (
        <div className="mail-details">
            <div className="tool-bar">
                <button onClick={onBack} ><i className="fa-solid fa-arrow-left"></i></button>
                <button onClick={onOpenNewWindow}><i className="fa-solid fa-up-right-from-square"></i></button>
                <button onClick={onCrateNote}><i className="fa-solid fa-notes-medical"></i></button>

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
                <h4>{body}</h4>
            </div>

        </div>

    )
}