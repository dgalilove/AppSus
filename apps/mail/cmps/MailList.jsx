import { mailService } from "../services/mail.service.js"
import { MailPreview } from "./MailPreview.jsx"

const { useNavigate } = ReactRouterDOM


export function MailList({ mailList, onSetFilterBy }) {

    const navigate = useNavigate()

    if (!mailList) return <div>Loading...</div>
    if (mailList.length === 0) return <div>No Such Data</div>

    function onMailOpen(mailId) {
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isRead: true }
                mailService.save(mail)
                navigate(`/mail/${mailId}`)
            })
    }


    return <div className="mail-list">
        <ul>
            {mailList.map(mail => {
                const classIsRead = mail.isRead ? 'read' : ''


                return (
                    <li onClick={() => onMailOpen(mail.id)} key={mail.id} className={classIsRead}>
                        <MailPreview mail={mail} onSetFilterBy={onSetFilterBy} />
                    </li>
                )
            })}
        </ul>

    </div>
}
