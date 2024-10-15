import { mailService } from "../services/mail.service.js"
import { MailPreview } from "./MailPreview.jsx"
import { SearchBar } from "./SearchBar.jsx"

const { useNavigate } = ReactRouterDOM


export function MailList({ mailList, onSetFilterBy, onRemoveMail }) {

    const navigate = useNavigate()

    if (!mailList) return <div>Loading...</div>

    function onMailOpen(mailId) {
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isRead: true }
                mailService.save(mail)
                navigate(`/mail/${mailId}`)
            })
    }

    return <div className="mail-list">
        {mailList.length === 0 ? <div>No Such Data</div> :
            <ul>
                {mailList.map(mail => {
                    const classIsRead = mail.isRead ? 'read' : ''
                    return (
                        <li onClick={() => onMailOpen(mail.id)} key={mail.id} className={classIsRead}>
                            <MailPreview mail={mail} onSetFilterBy={onSetFilterBy} onRemoveMail={onRemoveMail} />
                        </li>
                    )
                })}
            </ul>
        }


    </div>
}
