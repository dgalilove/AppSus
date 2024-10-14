// mail service

import { storageService } from "../../../services/async-storage.service.js"
import { loadFromStorage, saveToStorage } from "../../../services/storage.service.js"

const ZMAIL_DB = 'zmail_db'

_createMails()

export const mailService = {
    query,
    get,
    save,
    remove,
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
    // .then(mails => {
    //     if (filterBy.status === 'inbox') {
    //         mails = mails.filter(mail => mail.to === loggedUser.email)
    //     }
    //     else if (filterBy.status === 'sent') {
    //         mails = mails.filter(mail => mail.from === loggedUser.email)
    //     }
    //     else if (filterBy.status === 'trash') {
    //         mails = mails.filter(mail => mail.removeAt)
    //     }
    //     else if (filterBy.status === 'draft') {
    //         mails = mails.filter(mail => !mail.sentAt && mail.openAt)
    //     }
    // })
}

function get(mailId) {
    return storageService.get(ZMAIL_DB, mailId)
}

function remove(mailId) {
    return storageService.remove(ZMAIL_DB, mailId)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(ZMAIL_DB, mail)
    } else {
        mail.createdAt = mail.updatedAt = Date.now()
        return storageService.post(ZMAIL_DB, mail)
    }
}

function _createMails() {
    let mails = loadFromStorage(ZMAIL_DB)
    if (!mails || !mails.length) {
        mails = [
            {
                id: 'e101',
                createdAt: new Date("2024-10-12T12:28:30").getTime(),
                subject: 'Thousands of Right to Buy tickets for FIFA World Cup 26™ available on FIFA Collect',
                body: 'Europe First Timers Drop is now live. Collect digital moments featuring European players\' memorable World Cup debut goals, including Johan Cruyff (Netherlands) vs Argentina in 1974, Kevin De Bruyne (Belgium) vs USA in 2014, and Robert Lewandowski (Poland) vs Saudi Arabia in 2022.Claim the entire collection and complete the challenge to earn one of 460 pairs of Right to Buy (RTB) tickets for the FIFA World Cup 26™ group stage matches. Your seat awaits in one of the host cities across Canada, Mexico and USA.',
                isRead: false,
                sentAt: new Date("2024-10-12T12:36:30").getTime(),
                removeAt: null,
                name: 'FIFA',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e102',
                createdAt: new Date("2024-10-12T12:25:30").getTime(),
                subject: 'International football is back - be ready!',
                body: 'THE WORLD\'S GAME, YOUR TEAM\'S COLOURS.IG PASSION IS BACK ON THE PITCH.AS INTERNATIONAL FOOTBALL RETURNS, IT\'S TIME TO GEAR UP AND SHOW YOUR COLOURS.',
                isRead: true,
                sentAt: new Date("2024-10-10T12:47:30").getTime(),
                removeAt: null,
                name: 'FIFA Store',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e103',
                createdAt: new Date("2024-10-13T09:15:00").getTime(),
                subject: 'Get your exclusive World Cup 26™ gear!',
                body: 'Celebrate the FIFA World Cup 26™ with exclusive, limited edition gear. Shop now and show your support for your favorite team. Available in select regions.',
                isRead: false,
                sentAt: new Date("2024-10-13T09:20:00").getTime(),
                removeAt: null,
                name: 'FIFA Store',
                isStar: true,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e104',
                createdAt: new Date("2024-10-11T08:45:00").getTime(),
                subject: 'Watch live: World Cup 26™ qualifiers!',
                body: 'Tune in live to watch the intense qualifiers for the FIFA World Cup 26™. Teams are battling it out for their place on the world stage!',
                isRead: true,
                sentAt: new Date("2024-10-11T08:50:00").getTime(),
                removeAt: null,
                name: 'FIFA Live',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e105',
                createdAt: new Date("2024-10-14T14:30:00").getTime(),
                subject: 'Win VIP tickets to the World Cup 26™ Final!',
                body: 'Enter our contest to win VIP tickets to the FIFA World Cup 26™ Final! Experience the game in luxury with exclusive perks and front-row seats.',
                isRead: false,
                sentAt: new Date("2024-10-14T14:35:00").getTime(),
                removeAt: null,
                name: 'FIFA Promotions',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e106',
                createdAt: new Date("2024-10-12T11:00:00").getTime(),
                subject: 'World Cup 26™ merchandise now available!',
                body: 'Official FIFA World Cup 26™ merchandise has just dropped! From jerseys to collectible memorabilia, get yours now before they sell out.',
                isRead: false,
                sentAt: new Date("2024-10-12T11:05:00").getTime(),
                removeAt: null,
                name: 'FIFA Store',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e107',
                createdAt: new Date("2024-10-09T16:30:00").getTime(),
                subject: 'Your chance to meet World Cup legends!',
                body: 'Meet your favorite World Cup legends with our exclusive event. Limited spots available. Register now for a once-in-a-lifetime opportunity!',
                isRead: true,
                sentAt: new Date("2024-10-09T16:40:00").getTime(),
                removeAt: null,
                isStar: true,
                name: 'FIFA Experiences',
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e108',
                createdAt: new Date("2024-10-10T12:00:00").getTime(),
                subject: 'Early access to World Cup 26™ tickets!',
                body: 'As a loyal FIFA fan, you get early access to FIFA World Cup 26™ tickets. Secure your seat today before tickets go on sale to the public.',
                isRead: false,
                sentAt: new Date("2024-10-10T12:05:00").getTime(),
                removeAt: null,
                name: 'FIFA Tickets',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e109',
                createdAt: new Date("2024-10-11T17:15:00").getTime(),
                subject: 'Reminder: World Cup 26™ digital collectibles!',
                body: 'Don\’t miss out on owning FIFA World Cup 26™ digital collectibles! Collect your favorite moments and trade with fans around the world.',
                isRead: true,
                sentAt: new Date("2024-10-11T17:20:00").getTime(),
                removeAt: null,
                name: 'FIFA Collect',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e110',
                createdAt: new Date("2024-10-13T10:25:00").getTime(),
                subject: 'Exclusive discounts for World Cup 26™ fans!',
                body: 'FIFA World Cup 26™ fans get exclusive discounts on travel and accommodation in host cities across Canada, Mexico, and USA. Plan your trip now!',
                isRead: false,
                sentAt: new Date("2024-10-13T10:30:00").getTime(),
                removeAt: null,
                name: 'FIFA Travel',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e111',
                createdAt: new Date("2024-10-12T13:40:00").getTime(),
                subject: 'World Cup 26™ trivia: Test your knowledge!',
                body: 'How well do you know the history of the FIFA World Cup? Test your knowledge and compete with fans worldwide in our latest trivia challenge!',
                isRead: true,
                sentAt: new Date("2024-10-12T13:45:00").getTime(),
                removeAt: null,
                name: 'FIFA Fun',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            },
            {
                id: 'e112',
                createdAt: new Date("2024-10-14T08:30:00").getTime(),
                subject: 'New match schedules for FIFA World Cup 26™',
                body: 'Check out the latest match schedules for FIFA World Cup 26™ group stage and knockout rounds. Don’t miss any action from your favorite teams!',
                isRead: false,
                sentAt: new Date("2024-10-14T08:35:00").getTime(),
                removeAt: null,
                name: 'FIFA Updates',
                isStar: false,
                from: 'noreply@mailing.fifa.com',
                to: 'user@appsus.com'
            }
        ]
        console.log(mails)
        saveToStorage(ZMAIL_DB, mails)
    }
}