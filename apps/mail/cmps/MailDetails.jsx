import { mailService } from "../services/mail.service.js"

const { useParams, useNavigate, Link } = ReactRouterDOM
const { useState, useEffect } = React

export function MailDetails() {

    const [mail, setMail] = useState(null)
    const { mailId } = useParams()
    const navigate = useNavigate()
    const { status } = useParams()

    useEffect(() => {
        mailService.get(mailId)
            .then(mail => {
                setMail(mail)
            })
    }, [mailId])

    function onBack() {
        navigate(`/mail/${status}`)
    }

    if (!mail) return <div>Loading...</div>

    const { subject, body, from, sentAt, name } = mail
    const date = new Date(sentAt).toString().split(' ')
    return (
        <div className="mail-details">
            <div className="tool-bar">
                <button onClick={onBack} ><i className="fa-solid fa-arrow-left"></i></button>
            </div>
            <div className="body-details">
                <div className="header">
                    <h2>{subject}</h2>
                    <div className="header-tool-bar">
                        <button><i className="fa-solid fa-print"></i></button>
                        <button><i className="fa-solid fa-up-right-from-square"></i></button>
                    </div>
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