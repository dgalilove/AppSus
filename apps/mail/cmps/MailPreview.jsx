import { LongTxt } from "./LongTxt.jsx"

const { useState, useEffect, useRef } = React

export function MailPreview({ mail }) {

    const { subject, body, sentAt } = mail
    const date = new Date(sentAt)

    return (
        <React.Fragment>
            <h2>{subject}</h2>
            <h3><LongTxt txt={body} /></h3>
            <h4>{date.getDate()}.{date.getMonth()}</h4>
        </React.Fragment>
    )
}