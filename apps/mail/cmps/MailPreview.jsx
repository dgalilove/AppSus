import { mailService } from "../services/mail.service.js"

const { useParams, useNavigate, Link } = ReactRouterDOM
const { useState, useEffect } = React

export function MailPreview() {

    const [mail, setMail] = useState(null)
    const { mailId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        mailService.get(mailId)
            .then(mail => {
                setMail(mail)
            })
    }, [mailId])

    if (!mail) return <div>Loading...</div>

    const { subject, body, from, sentAt, name } = mail
    const date = new Date(sentAt).toString().split(' ')
    return (
        <div className="mail-preview">
            <button ><Link to={'/mail'}>Back</Link></button>
            <h2>{subject}</h2>
            <h3>{name}</h3>
            <p>{`<${from}>`}{`${date[1]} ${date[2]}, ${date[3]}, ${date[4]}`}</p>
            <h4>{body}</h4>
        </div>

    )
}