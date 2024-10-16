import { mailService } from "../services/mail.service.js"
import { MailPreview } from "./MailPreview.jsx"

const { useParams, useNavigate } = ReactRouterDOM
const { useEffect } = React


export function MailList({ mailList, onSetFilterBy, onRemoveMail, filterBy }) {

    const navigate = useNavigate()
    const { status } = useParams()

    useEffect(() => {
        onSetFilterBy(prev => ({ ...prev }))
    }, [])


    if (!mailList) return <div>Loading...</div>

    function onMailOpen(mailId) {
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isRead: true }
                mailService.save(mail)
                navigate(`/mail/${status}/${mailId}`)
            })
    }


    return <div className="mail-list">
        <div className="sorting-container">
            <button className={filterBy.sort === 'date' ? 'active' : ''} onClick={() => onSetFilterBy({ sort: 'date' })}>date</button>
            <button className={filterBy.sort === 'name' ? 'active' : ''} onClick={() => onSetFilterBy({ sort: 'name' })}>name</button>
            <button className={filterBy.sort === 'subject' ? 'active' : ''} onClick={() => onSetFilterBy({ sort: 'subject' })}>subject</button>
        </div>
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
