// mail service

import { storageService } from "../../../services/async-storage.service.js"
import { loadFromStorage, saveToStorage } from "../../../services/storage.service.js"
import { utilService } from "../../../services/util.service.js"

const ZMAIL_DB = 'zmail_db'
const ZMAIL_REMOVED_DB = 'zmail_removed_db'

_createMails()

export const mailService = {
    query,
    get,
    save,
    remove,
    getFilterFromSearchParams
}

const loggedUser = {
    email: 'user@appsus.com',
    fullName: 'Eli Copter'
}

// const filterBy = {
//     status: 'inbox',// sent/trash/draft
//     txt: 'puki',
//     isRead: true,
//     isStared: true,
//     labels: []
// }

function query(filterBy = {}) {
    return storageService.query(ZMAIL_DB)
        .then(mails => {
            if (filterBy.status === 'inbox') {
                mails = mails.filter(mail => !mail.removeAt && mail.to === loggedUser.email)
            }
            else if (filterBy.status === 'sent') {
                mails = mails.filter(mail => {
                    return mail.from === loggedUser.email
                })
            }
            else if (filterBy.status === 'trash') {
                mails = mails.filter(mail => mail.removeAt)
            }
            else if (filterBy.status === 'draft') {
                mails = mails.filter(mail => !mail.sentAt && mail.openAt)
            }
            else if (filterBy.status === 'stared') {
                mails = mails.filter(mail => mail.isStar)
            }

            if (filterBy.isRead === 'unread') {
                mails = mails.filter(mail => !mail.isRead)
            }
            if (filterBy.search) {
                const regExp = new RegExp(filterBy.search, 'i')
                mails = mails.filter(mail => regExp.test(mail.name) || regExp.test(mail.subject) || regExp.test(mail.body))
            }
            if (filterBy.sort) {
                if (filterBy.sort === 'date') {
                    mails.sort((c1, c2) => (c1.sentAt - c2.sentAt) * -1)
                }
                if (filterBy.sort === 'name') {
                    mails.sort((c1, c2) => c1.name.localeCompare(c2.name))
                }
                if (filterBy.sort === 'subject') {
                    mails.sort((c1, c2) => c1.subject.localeCompare(c2.subject))
                }
            }
            return mails
        })
}



function get(mailId) {
    return storageService.get(ZMAIL_DB, mailId)
}

function remove(mailId) {
    return get(mailId).then(mail => {
        if (!mail.removeAt) {
            mail.removeAt = Date.now()
            return storageService.put(ZMAIL_DB, mail)
        } else {
            return storageService.remove(ZMAIL_DB, mailId)

        }
    })

}

function save(mail) {
    if (mail.id) {
        return storageService.put(ZMAIL_DB, mail)
    } else {
        const newMail = _createMail(mail.to, mail.subject, mail.body)
        return storageService.post(ZMAIL_DB, newMail)
    }
}


function getDefaultFilter() {
    return { txt: '', status: 'inbox', compose: '', to: '', subject: '', body: '' }
}


function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}


function _createMails() {
    let mails = loadFromStorage(ZMAIL_DB)
    if (!mails || !mails.length) {
        mails = [
            {
                id: 'e103',
                createdAt: new Date("2024-10-11T14:15:00").getTime(),
                subject: 'New Gear Available for the Upcoming Season!',
                body: 'Check out the latest team jerseys and merchandise just in time for the new season!',
                isRead: false,
                sentAt: new Date("2024-10-11T14:20:00").getTime(),
                removeAt: null,
                name: 'Sports Merch',
                isStar: false,
                from: 'noreply@sportsmerch.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e104',
                createdAt: new Date("2024-10-09T09:00:00").getTime(),
                subject: 'Exclusive Match Tickets Available Now!',
                body: 'Get your tickets for the upcoming match! Don\'t miss out on the action.',
                isRead: true,
                sentAt: new Date("2024-10-09T09:05:00").getTime(),
                removeAt: null,
                name: 'Ticketing Team',
                isStar: false,
                from: 'noreply@tickets.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e105',
                createdAt: new Date("2024-10-12T10:10:10").getTime(),
                subject: 'Fan Meet and Greet Event!',
                body: 'Join us for an exclusive fan meet and greet with your favorite players next week!',
                isRead: false,
                sentAt: new Date("2024-10-12T10:15:10").getTime(),
                removeAt: null,
                name: 'Fan Engagement',
                isStar: true,
                from: 'noreply@fanevents.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e106',
                createdAt: new Date("2024-10-11T15:00:00").getTime(),
                subject: 'Reminder: Upcoming Match!',
                body: 'Just a reminder that the match is this Saturday at 3 PM. Get ready!',
                isRead: false,
                sentAt: new Date("2024-10-11T15:05:00").getTime(),
                removeAt: null,
                name: 'Match Alerts',
                isStar: false,
                from: 'noreply@matches.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e107',
                createdAt: new Date("2024-10-12T11:30:00").getTime(),
                subject: 'Special Offer: Buy One Get One Free!',
                body: 'For this week only, buy one item and get another free! Shop now.',
                isRead: true,
                sentAt: new Date("2024-10-12T11:35:00").getTime(),
                removeAt: null,
                name: 'Store Promotions',
                isStar: false,
                from: 'noreply@store.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e108',
                createdAt: new Date("2024-10-10T08:45:00").getTime(),
                subject: 'Watch the Highlights from Last Night\'s Game!',
                body: 'Catch up on all the action from last night with our highlights video!',
                isRead: false,
                sentAt: new Date("2024-10-10T08:50:00").getTime(),
                removeAt: null,
                name: 'Highlights Team',
                isStar: true,
                from: 'noreply@highlights.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e109',
                createdAt: new Date("2024-10-12T13:00:00").getTime(),
                subject: 'New Training Programs Available!',
                body: 'Sign up for our new training programs and improve your skills this season!',
                isRead: false,
                sentAt: new Date("2024-10-12T13:05:00").getTime(),
                removeAt: null,
                name: 'Training Center',
                isStar: false,
                from: 'noreply@training.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e110',
                createdAt: new Date("2024-10-10T16:00:00").getTime(),
                subject: 'Your Feedback Matters!',
                body: 'We want to hear from you! Please take a moment to fill out our survey.',
                isRead: true,
                sentAt: new Date("2024-10-10T16:05:00").getTime(),
                removeAt: null,
                name: 'Feedback Team',
                isStar: false,
                from: 'noreply@feedback.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e111',
                createdAt: new Date("2024-10-12T14:15:00").getTime(),
                subject: 'Join Our Fantasy League!',
                body: 'Think you have what it takes? Join our fantasy league and compete with friends!',
                isRead: false,
                sentAt: new Date("2024-10-12T14:20:00").getTime(),
                removeAt: null,
                name: 'Fantasy League',
                isStar: false,
                from: 'noreply@fantasyleague.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e112',
                createdAt: new Date("2024-10-10T12:30:00").getTime(),
                subject: 'Important Update on League Rules',
                body: 'Please read the updated league rules before the new season starts.',
                isRead: true,
                sentAt: new Date("2024-10-10T12:35:00").getTime(),
                removeAt: null,
                name: 'League Admin',
                isStar: false,
                from: 'noreply@league.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e113',
                createdAt: new Date("2024-10-11T11:00:00").getTime(),
                subject: 'Special Event: Meet the Coach!',
                body: 'Join us for a special event where you can meet the team coach and ask questions!',
                isRead: false,
                sentAt: new Date("2024-10-11T11:05:00").getTime(),
                removeAt: null,
                name: 'Team Events',
                isStar: true,
                from: 'noreply@teamevents.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e114',
                createdAt: new Date("2024-10-12T09:30:00").getTime(),
                subject: 'New Video Series: Behind the Scenes!',
                body: 'Don\'t miss our new video series giving you a behind-the-scenes look at the team.',
                isRead: false,
                sentAt: new Date("2024-10-12T09:35:00").getTime(),
                removeAt: null,
                name: 'Media Team',
                isStar: false,
                from: 'noreply@mediatteam.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e115',
                createdAt: new Date("2024-10-10T14:00:00").getTime(),
                subject: 'Special Charity Match Coming Up!',
                body: 'Join us for a charity match and help raise funds for a great cause!',
                isRead: true,
                sentAt: new Date("2024-10-10T14:05:00").getTime(),
                removeAt: null,
                name: 'Charity Team',
                isStar: false,
                from: 'noreply@charityevents.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e116',
                createdAt: new Date("2024-10-11T17:45:00").getTime(),
                subject: 'Sign Up for Our Newsletter!',
                body: 'Stay updated on all things sports! Sign up for our newsletter today.',
                isRead: false,
                sentAt: new Date("2024-10-11T17:50:00").getTime(),
                removeAt: null,
                name: 'Newsletter Team',
                isStar: false,
                from: 'noreply@newsletter.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e117',
                createdAt: new Date("2024-10-09T11:30:00").getTime(),
                subject: 'Player of the Month Announcement!',
                body: 'Congratulations to our Player of the Month! Find out who it is!',
                isRead: true,
                sentAt: new Date("2024-10-09T11:35:00").getTime(),
                removeAt: null,
                name: 'Awards Team',
                isStar: false,
                from: 'noreply@awards.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e118',
                createdAt: new Date("2024-10-12T15:15:00").getTime(),
                subject: 'Winter Training Schedule Released!',
                body: 'Check out our new winter training schedule and sign up now!',
                isRead: false,
                sentAt: new Date("2024-10-12T15:20:00").getTime(),
                removeAt: null,
                name: 'Training Staff',
                isStar: false,
                from: 'noreply@wintertraining.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e119',
                createdAt: new Date("2024-10-10T18:00:00").getTime(),
                subject: 'Exclusive Merchandise Drop!',
                body: 'Don’t miss our exclusive merchandise drop! Limited stock available.',
                isRead: false,
                sentAt: new Date("2024-10-10T18:05:00").getTime(),
                removeAt: null,
                name: 'Merch Team',
                isStar: true,
                from: 'noreply@merchdrop.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e120',
                createdAt: new Date("2024-10-11T19:00:00").getTime(),
                subject: 'End of Season Party Invite!',
                body: 'You are invited to our end-of-season party! Come celebrate with us!',
                isRead: false,
                sentAt: new Date("2024-10-11T19:05:00").getTime(),
                removeAt: null,
                name: 'Party Organizers',
                isStar: false,
                from: 'noreply@parties.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e121',
                createdAt: new Date("2024-10-10T20:30:00").getTime(),
                subject: 'Volunteer Opportunities Available!',
                body: 'Join our team as a volunteer! Help us make events successful.',
                isRead: false,
                sentAt: new Date("2024-10-10T20:35:00").getTime(),
                removeAt: null,
                name: 'Volunteer Team',
                isStar: false,
                from: 'noreply@volunteers.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e122',
                createdAt: new Date("2024-10-12T16:45:00").getTime(),
                subject: 'Health and Safety Guidelines Update!',
                body: 'Please review the updated health and safety guidelines for this season.',
                isRead: true,
                sentAt: new Date("2024-10-12T16:50:00").getTime(),
                removeAt: null,
                name: 'Safety Team',
                isStar: false,
                from: 'noreply@safety.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e123',
                createdAt: new Date("2024-10-09T22:00:00").getTime(),
                subject: 'Last Chance to Register for Camps!',
                body: 'Don’t miss out! Last chance to register for our upcoming sports camps.',
                isRead: false,
                sentAt: new Date("2024-10-09T22:05:00").getTime(),
                removeAt: null,
                name: 'Camp Coordinator',
                isStar: true,
                from: 'noreply@camps.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e124',
                createdAt: new Date("2024-10-10T23:15:00").getTime(),
                subject: 'Meet Our New Players!',
                body: 'Get to know our new players who joined the team this season!',
                isRead: false,
                sentAt: new Date("2024-10-10T23:20:00").getTime(),
                removeAt: null,
                name: 'Player Management',
                isStar: false,
                from: 'noreply@players.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e125',
                createdAt: new Date("2024-10-12T20:00:00").getTime(),
                subject: 'October Highlights and Upcoming Events',
                body: 'Check out our highlights from October and see what’s coming up next!',
                isRead: false,
                sentAt: new Date("2024-10-12T20:05:00").getTime(),
                removeAt: null,
                name: 'Event Team',
                isStar: false,
                from: 'noreply@events.com',
                to: 'user@appsus.com'
            }
        ]

        console.log(mails)
        saveToStorage(ZMAIL_DB, mails)
    }
}


function _createMail(to, subject, body) {
    return {
        id: utilService.makeId(),
        createdAt: Date.now(),
        subject,
        body,
        isRead: false,
        sentAt: Date.now(),
        removeAt: null,
        name: loggedUser.fullName,
        isStar: false,
        from: loggedUser.email,
        to
    }
}