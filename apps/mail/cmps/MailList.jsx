import { mailService } from "../services/mail.service.js"

const { useNavigate } = ReactRouterDOM
const { useRef, useState } = React


export function MailList({ mailList }) {

    const navigate = useNavigate()
    const starRef = useRef()

    if (!mailList) return <div>Loading...</div>

    function onMailOpen(mailId) {
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isRead: true }
                mailService.save(mail)
                navigate(`/mail/${mailId}`)
            })
    }

    function onStarClick(ev, mailId) {
        ev.stopPropagation()
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isStar: !mail.isStar }
                mailService.save(mail)
            })
    }


    return <div className="mail-list">
        <ul>
            {mailList.map(mail => {
                const classIsRead = mail.isRead ? 'read' : ''
                const { name, subject, sentAt, isStar, body } = mail
                const date = new Date(sentAt).toDateString().split(' ')

                const starStyle = {
                    cursor: 'pointer',
                    color: isStar ? 'gold' : 'gray',
                    fill: 'gold',
                    fontSize: `14px`,
                    border: 'none',
                }
                console.log(date)

                return (
                    <li onClick={() => onMailOpen(mail.id)} key={mail.id} className={classIsRead}>

                        <button className="star-btn"
                            ref={starRef}
                            onClick={(event) => onStarClick(event, mail.id)}
                            style={starStyle}>
                            <div></div>
                            <span>{isStar ? '★' : '☆'}</span>
                        </button>

                        <h2>{name}</h2>
                        <h3>{subject} - <span className="gray">{body}</span></h3>
                        <h4>{date[1]} {date[2]}</h4>
                    </li>
                )
            })}
        </ul>

    </div>
}
