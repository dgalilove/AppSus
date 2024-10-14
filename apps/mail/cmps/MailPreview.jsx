import { mailService } from "../services/mail.service.js"

const { useRef, useState, useEffect } = React

export function MailPreview({ mail, onSetFilterBy, onRemoveMail }) {

    const starRef = useRef()
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        console.log(isHover)
    }, [isHover])

    function onStarClick(ev, mailId) {
        ev.stopPropagation()
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isStar: !mail.isStar }
                mailService.save(mail)
                    .then(mails => {
                        onSetFilterBy({})
                    })

            })
    }

    function onMailReadMark(ev, mailId) {
        ev.stopPropagation()
        mailService.get(mailId)
            .then(mail => {
                mail = { ...mail, isRead: !mail.isRead }
                mailService.save(mail)
                    .then(mails => {
                        onSetFilterBy({})
                    })

            })
    }

    function onRemove(ev, mailId) {
        ev.stopPropagation()
        onRemoveMail(mailId)
    }


    const { name, subject, sentAt, isStar, body, isRead } = mail
    console.log(isRead)
    const date = new Date(sentAt).toDateString().split(' ')
    const staredClass = isStar ? 'stared' : ''
    const starStyle = {
        cursor: 'pointer',
        fill: 'gold',
        fontSize: `14px`,
        border: 'none',
    }

    return (
        <React.Fragment >
            <button className={`star-btn ${staredClass}`}
                ref={starRef}
                onClick={(event) => onStarClick(event, mail.id)}
                style={starStyle}>
                <div className="shadow"></div>
                <span>{isStar ? '★' : '☆'}</span>
            </button>

            <h2>{name}</h2>
            <h3>{subject} - <span className="gray">{body}</span></h3>
            <h4>{date[1]} {date[2]}</h4>

            <div className="tool-bar">
                <i className="fa-regular fa-trash-can" onClick={(event) => onRemove(event, mail.id)}></i>
                {isRead ?
                    <i className="fa-regular fa-envelope" onClick={(event) => onMailReadMark(event, mail.id)}></i>
                    : <i className="fa-regular fa-envelope-open" onClick={(event) => onMailReadMark(event, mail.id)}></i>}
            </div>
        </React.Fragment>

    )
}