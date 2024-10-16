import { mailService } from "../services/mail.service.js"
import { MailPreview } from "./MailPreview.jsx"

const { useParams, useNavigate } = ReactRouterDOM


export function MailList({ mailList, onSetFilterBy, onRemoveMail, filterBy, openCompose }) {

    const navigate = useNavigate()
    const { status } = useParams()

    if (!mailList) return <div>Loading...</div>

    function onMailOpen(mail) {
        if (status === 'draft') {
            // navigate = ({
            //     pathname: `/mail/${status}`,
            //     // search: `?title=${mail.subject}&text=${mail.body}`
            // })
            navigate(`/mail/${status}/${mail.id}?compose=new&to=${mail.to}&subject=${mail.subject}&body=${mail.body}`)
            openCompose()


        } else {
            mailService.get(mail.id)
                .then(mail => {
                    mail = { ...mail, isRead: true }
                    mailService.save(mail)
                    navigate(`/mail/${status}/${mail.id}`)
                })
        }
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
                    const draftClass = status === 'draft' ? 'draft' : ''
                    return (
                        <li onClick={() => onMailOpen(mail)} key={mail.id} className={status === 'draft' ? draftClass : classIsRead}>
                            <MailPreview mail={mail} onSetFilterBy={onSetFilterBy} onRemoveMail={onRemoveMail} status={status} />
                        </li>
                    )
                })}
            </ul>
        }


    </div>
}
