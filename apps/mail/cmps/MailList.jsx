import { MailPreview } from "./mailPreview.jsx"

export function MailList({ mailList }) {
    if (!mailList) return <div>Loading...</div>
    return <div className="mail-list">
        <ul>
            {mailList.map(mail => {
                return (
                    <li key={mail.id}>
                        <MailPreview mail={mail} />
                    </li>
                )
            })}
        </ul>

    </div>
}
