import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM


export function NewCompose({ closeCompose, onSetFilterBy, filterBy }) {

    const [mailToAdd, setMailToAdd] = useState('')
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    const navigate = useNavigate()

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
        setMailToAdd(prevMail => ({ ...prevMail, ...prevMail, [field]: value }))
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
                <input required type="text" placeholder={'To'} name='to' onChange={handleChange} value={to} />
                <input required type="text" placeholder={'Subject'} name='subject' onChange={handleChange} value={subject} />
                <textarea required type="text" name='body' onChange={handleChange} value={body} />
                <button>Send</button>
            </form>
        </div>
    )
}