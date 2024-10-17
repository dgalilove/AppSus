import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, useParams } = ReactRouterDOM


export function NewCompose({ closeCompose, onSetFilterBy, filterBy }) {

    const [mailToAdd, setMailToAdd] = useState('')
    const [filterByToEdit, setFilterByToEdit] = useState('')
    const [draftedMail, setDraftedMail] = useState('')
    const navigate = useNavigate()

    const { mailId } = useParams()
    const { status } = useParams()

    const timeOutRef = useRef()



    useEffect(() => {
        if (mailId) {
            mailService.get(mailId)
                .then(mail => {
                    console.log(mail)
                    setMailToAdd(mail)
                    setFilterByToEdit(prevFilterByToEdit => ({ ...prevFilterByToEdit, to: mail.to || '', subject: mail.subject || '', body: mail.body || '' }))
                })
        } else {
            setFilterByToEdit({ ...filterBy })
        }
    }, [])


    useEffect(() => {
        if (filterByToEdit.to !== '' ||
            filterByToEdit.subject !== '' ||
            filterByToEdit.body !== '') {
            clearTimeout(timeOutRef.current)
            timeOutRef.current = setTimeout(() => {
                mailService.save(mailToAdd)
                    .then(mail => {
                        onSetFilterBy(filterByToEdit)
                        setMailToAdd(mail)
                        setDraftedMail(mail)
                    })
                    .catch(err => {
                        console.log('err:', err)
                    })
            }, 5000)


        }
    }, [filterByToEdit])


    function handleChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setMailToAdd(prevMail => ({ ...prevMail, [field]: value }))
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onAddMail(ev) {
        ev.preventDefault()
        const date = Date.now()
        console.log(date)
        mailService.save(mailToAdd, date)
            .then(mail => {
                closeCompose()
            })
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onCloseClick() {
        if (filterByToEdit.to === '' &&
            filterByToEdit.subject === '' &&
            filterByToEdit.body === ''
        ) {
            if (draftedMail) {
                console.log('removed')

                onSetFilterBy(filterByToEdit)
                mailService.remove(draftedMail.id)
                    .then(mail => {
                        onSetFilterBy(prevFilterBy => ({ ...prevFilterBy, to: '', subject: '', body: '' }))
                    }).catch(console.log)
            }
        }
        closeCompose()
        navigate(`/mail/${status}`)
    }


    const { to, subject, body } = filterByToEdit

    return (
        <div className="new-compose">
            <div className="title-and-exit">
                <div className="buttons">
                    <button onClick={onCloseClick}>x</button>
                </div>
                <h2>{filterByToEdit.subject || 'New message'}</h2>
            </div>
            <form onSubmit={onAddMail}>
                <div className="to-line form-line">
                    <label htmlFor="to">To</label>
                    <input id={'to'} required type="text" name='to' value={to} onChange={handleChange} />
                </div>
                <div className="subject-line form-line">
                    <input required type="text" placeholder={'Subject'} name='subject' value={subject} onChange={handleChange} />
                </div>
                <textarea required type="text" name='body' value={body} onChange={handleChange} />
                <div className="submit-line">
                    <button>Send</button>
                </div>
            </form>
        </div>
    )
}