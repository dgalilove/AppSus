import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM


export function NewCompose({ closeCompose, onSetFilterBy, filterBy }) {

    const [mailToAdd, setMailToAdd] = useState('')
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })


    useEffect(() => {
        setMailToAdd(prevMail => ({ ...prevMail, to: filterByToEdit.to || '', subject: filterByToEdit.subject || '', body: filterByToEdit.body || '' }))
    }, [])


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
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
        mailService.save(mailToAdd)
            .then(mail => {
                console.log('mail Saved')
                closeCompose()
            })
            .catch(err => {
                console.log('err:', err)
            })
    }


    const { to, subject, body } = filterByToEdit

    return (
        <div className="new-compose">
            <form onSubmit={onAddMail}>
                <button onClick={closeCompose}>x</button>
                <h2>New Message</h2>
                <input required type="text" placeholder={'To'} name='to' value={to} onChange={handleChange} />
                <input required type="text" placeholder={'Subject'} name='subject' value={subject} onChange={handleChange} />
                <textarea required type="text" name='body' value={body} onChange={handleChange} />
                <button>Send</button>
            </form>
        </div>
    )
}