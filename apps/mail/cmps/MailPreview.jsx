import { mailService } from "../services/mail.service.js"

const { useRef, useState, useEffect } = React

export function MailPreview({ mail, onSetFilterBy }) {

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


    const { name, subject, sentAt, isStar, body } = mail
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
                <div></div>
                <span>{isStar ? '★' : '☆'}</span>
            </button>

            <h2>{name}</h2>
            <h3>{subject} - <span className="gray">{body}</span></h3>
            <h4>{date[1]} {date[2]}</h4>
        </React.Fragment>

    )
}