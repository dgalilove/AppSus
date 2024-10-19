// mail service

import { storageService } from "../../../services/async-storage.service.js"
import { loadFromStorage, saveToStorage } from "../../../services/storage.service.js"
import { utilService } from "../../../services/util.service.js"

const ZMAIL_DB = 'zmail_db'

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

function query(filterBy = {}, status = 'inbox') {
    return storageService.query(ZMAIL_DB)
        .then(mails => {
            if (status === 'inbox') {
                mails = mails.filter(mail => !mail.removeAt && mail.to === loggedUser.email && mail.sentAt)
            }
            else if (status === 'sent') {
                mails = mails.filter(mail => {
                    return mail.from === loggedUser.email && mail.sentAt
                })
            }
            else if (status === 'trash') {
                mails = mails.filter(mail => mail.removeAt)
            }
            else if (status === 'draft') {
                mails = mails.filter(mail => !mail.sentAt && !mail.removeAt && mail.from === loggedUser.email)
            }
            else if (status === 'stared') {
                mails = mails.filter(mail => mail.isStar && mail.sentAt)
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
                    if (status === 'draft') mails.sort((c1, c2) => (c1.createdAt - c2.createdAt) * -1)
                    else mails.sort((c1, c2) => (c1.sentAt - c2.sentAt) * -1)
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
        if (!mail.removeAt && mail.sentAt) {
            mail.removeAt = Date.now()
            return storageService.put(ZMAIL_DB, mail)
        } else {
            return storageService.remove(ZMAIL_DB, mailId)

        }
    })

}

function save(mail, dateNow = '') {
    if (mail.id) {
        if (!mail.sentAt) mail.sentAt = dateNow

        return storageService.put(ZMAIL_DB, mail)
    } else {
        const newMail = _createMail(mail.to, mail.subject, mail.body)
        return storageService.post(ZMAIL_DB, newMail)
    }
}

function getDefaultFilter() {
    return { txt: '', compose: '', to: '', subject: '', body: '' }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        if (filterBy.status) continue
        else {
            filterBy[field] = searchParams.get(field) || ''
        }
    }
    return filterBy
}

function _createMails() {
    let mails = loadFromStorage(ZMAIL_DB)
    if (!mails || !mails.length) {
        mails = [{
            "id": "e051",
            "createdAt": 1696778553000,
            "subject": "Thank You for Joining Us",
            "body": "We appreciate your presence in our community. Thank you!",
            "isRead": false,
            "sentAt": 1696780503000,
            "removeAt": null,
            "name": "Sales Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "salesteam@service.com"
        },
        {
            "id": "e052",
            "createdAt": 1696160073000,
            "subject": "Your Profile Update is Complete",
            "body": "Your profile has been successfully updated. Thank you!",
            "isRead": true,
            "sentAt": 1696146473000,
            "removeAt": null,
            "name": "Billing Department",
            "isStar": false,
            "from": "billing@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e053",
            "createdAt": 1696042493000,
            "subject": "Get Ready for Our Upcoming Events",
            "body": "Prepare for our upcoming events that you won’t want to miss!",
            "isRead": false,
            "sentAt": 1695980493000,
            "removeAt": null,
            "name": "Events Team",
            "isStar": true,
            "from": "eventsteam@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e054",
            "createdAt": 1696231273000,
            "subject": "A Gift for You!",
            "body": "As a token of appreciation, here’s a gift for you!",
            "isRead": true,
            "sentAt": 1696244873000,
            "removeAt": null,
            "name": "Marketing Team",
            "isStar": false,
            "from": "marketing@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e055",
            "createdAt": 1696040053000,
            "subject": "Exciting News Coming Soon",
            "body": "We have some exciting news just around the corner!",
            "isRead": false,
            "sentAt": 1696053653000,
            "removeAt": null,
            "name": "Feedback Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "feedbackteam@service.com"
        },
        {
            "id": "e056",
            "createdAt": 1696379053000,
            "subject": "Join Our Community Forum",
            "body": "Connect with others in our community forum to share experiences.",
            "isRead": true,
            "sentAt": 1696365453000,
            "removeAt": null,
            "name": "Community Team",
            "isStar": false,
            "from": "community@forum.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e057",
            "createdAt": 1696415053000,
            "subject": "Holiday Season Discounts",
            "body": "Enjoy special discounts this holiday season. Start shopping!",
            "isRead": false,
            "sentAt": 1696428653000,
            "removeAt": null,
            "name": "Loyalty Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "loyaltyteam@service.com"
        },
        {
            "id": "e058",
            "createdAt": 1696551653000,
            "subject": "New Feature Announcement",
            "body": "Check out our new feature and how it can benefit you.",
            "isRead": false,
            "sentAt": 1696538053000,
            "removeAt": null,
            "name": "Tech Team",
            "isStar": false,
            "from": "tech@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e059",
            "createdAt": 1696601253000,
            "subject": "Your Opinion Matters",
            "body": "Please take a moment to share your opinion with us.",
            "isRead": true,
            "sentAt": 1696614853000,
            "removeAt": null,
            "name": "Customer Support",
            "isStar": true,
            "from": "support@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e060",
            "createdAt": 1696410853000,
            "subject": "We Value Your Loyalty",
            "body": "Your loyalty means everything to us. Here’s a special offer.",
            "isRead": true,
            "sentAt": 1696424453000,
            "removeAt": null,
            "name": "Sales Team",
            "isStar": true,
            "from": "sales@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e061",
            "createdAt": 1696348453000,
            "subject": "Thank You for Your Feedback",
            "body": "Your feedback is important to us. Here’s what we’ve changed.",
            "isRead": false,
            "sentAt": 1696362053000,
            "removeAt": null,
            "name": "Marketing Team",
            "isStar": false,
            "from": "user@appsus.com",
            "to": "marketingteam@service.com"
        },
        {
            "id": "e062",
            "createdAt": 1696700853000,
            "subject": "Your Subscription Details",
            "body": "Here are the details of your subscription. Thank you!",
            "isRead": false,
            "sentAt": 1696714453000,
            "removeAt": null,
            "name": "Billing Department",
            "isStar": true,
            "from": "billing@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e063",
            "createdAt": 1696713053000,
            "subject": "Thank You for Your Feedback",
            "body": "We have processed your invoice. Please check your account.",
            "isRead": true,
            "sentAt": 1696726653000,
            "removeAt": null,
            "name": "Tech Team",
            "isStar": false,
            "from": "user@appsus.com",
            "to": "techteam@service.com"
        },
        {
            "id": "e064",
            "createdAt": 1696698053000,
            "subject": "Join Us for Our Webinar",
            "body": "Learn about new features in our upcoming webinar!",
            "isRead": false,
            "sentAt": 1696711653000,
            "removeAt": null,
            "name": "Webinar Team",
            "isStar": true,
            "from": "webinar@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e065",
            "createdAt": 1696723053000,
            "subject": "Exclusive Access for You",
            "body": "You’ve been selected for exclusive access to our new product.",
            "isRead": true,
            "sentAt": 1696736653000,
            "removeAt": null,
            "name": "Customer Support",
            "isStar": false,
            "from": "support@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e066",
            "createdAt": 1696740453000,
            "subject": "Your Opinion Matters!",
            "body": "Participate in our survey for a chance to win a prize.",
            "isRead": false,
            "sentAt": 1696754053000,
            "removeAt": null,
            "name": "Research Team",
            "isStar": true,
            "from": "research@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e067",
            "createdAt": 1696756653000,
            "subject": "Thank You for Your Purchase!",
            "body": "We hope you enjoy your purchase. Thank you for choosing us!",
            "isRead": true,
            "sentAt": 1696770253000,
            "removeAt": null,
            "name": "Sales Team",
            "isStar": false,
            "from": "sales@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e068",
            "createdAt": 1696781853000,
            "subject": "Your Subscription Will Renew Soon",
            "body": "Your subscription will renew in 3 days. Thank you!",
            "isRead": false,
            "sentAt": 1696795453000,
            "removeAt": null,
            "name": "Billing Department",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "billing@service.com"
        },
        {
            "id": "e069",
            "createdAt": 1696788253000,
            "subject": "We Have New Updates!",
            "body": "Check out the latest updates and features in your account.",
            "isRead": true,
            "sentAt": 1696801853000,
            "removeAt": null,
            "name": "Updates Team",
            "isStar": false,
            "from": "updates@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e070",
            "createdAt": 1696809653000,
            "subject": "Important Account Update",
            "body": "We have important updates regarding your account. Please review.",
            "isRead": false,
            "sentAt": 1696823253000,
            "removeAt": null,
            "name": "Legal Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "legalteam@service.com"
        },
        {
            "id": "e071",
            "createdAt": 1696835253000,
            "subject": "Exciting News Coming Soon!",
            "body": "We have some exciting news just around the corner!",
            "isRead": true,
            "sentAt": 1696848853000,
            "removeAt": null,
            "name": "Marketing Team",
            "isStar": false,
            "from": "marketing@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e072",
            "createdAt": 1696867253000,
            "subject": "Join Us for a Special Webinar",
            "body": "Learn about new features in our upcoming webinar!",
            "isRead": false,
            "sentAt": 1696880853000,
            "removeAt": null,
            "name": "Webinar Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "webinarteam@service.com"
        },
        {
            "id": "e073",
            "createdAt": 1696898053000,
            "subject": "You’ve Got a Surprise Waiting!",
            "body": "Open this email to find a special surprise just for you.",
            "isRead": true,
            "sentAt": 1696911653000,
            "removeAt": null,
            "name": "Surprise Team",
            "isStar": false,
            "from": "surprise@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e074",
            "createdAt": 1696916653000,
            "subject": "Don’t Miss Our Webinar!",
            "body": "Sign up now for our upcoming webinar on product usage.",
            "isRead": false,
            "sentAt": 1696930253000,
            "removeAt": null,
            "name": "Events Team",
            "isStar": true,
            "from": "events@webinars.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e075",
            "createdAt": 1696925053000,
            "subject": "Important Update Regarding Your Account",
            "body": "We have important updates regarding your account. Please review.",
            "isRead": false,
            "sentAt": 1696938653000,
            "removeAt": null,
            "name": "Legal Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "legalteam@service.com"
        },
        {
            "id": "e076",
            "createdAt": 1696943053000,
            "subject": "Your Subscription Will Renew Soon",
            "body": "Your subscription will renew in 3 days. Thank you!",
            "isRead": false,
            "sentAt": 1696956653000,
            "removeAt": null,
            "name": "Billing Team",
            "isStar": true,
            "from": "billing@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e077",
            "createdAt": 1696955453000,
            "subject": "Join Our Community Forum",
            "body": "Connect with other users in our community forum!",
            "isRead": false,
            "sentAt": 1696969053000,
            "removeAt": null,
            "name": "Community Team",
            "isStar": true,
            "from": "community@forum.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e078",
            "createdAt": 1696974253000,
            "subject": "Exclusive VIP Event Invitation",
            "body": "You’re invited to our exclusive VIP event next month!",
            "isRead": false,
            "sentAt": 1696987853000,
            "removeAt": null,
            "name": "Events Team",
            "isStar": true,
            "from": "vip@event.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e079",
            "createdAt": 1696985053000,
            "subject": "Congratulations! You’ve Earned a Reward",
            "body": "Thank you for your loyalty. Here’s a reward just for you!",
            "isRead": false,
            "sentAt": 1696998653000,
            "removeAt": null,
            "name": "Loyalty Team",
            "isStar": true,
            "from": "rewards@loyalty.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e080",
            "createdAt": 1696993053000,
            "subject": "Your Opinion Matters!",
            "body": "Participate in our survey for a chance to win a prize.",
            "isRead": false,
            "sentAt": 1697006653000,
            "removeAt": null,
            "name": "Research Team",
            "isStar": true,
            "from": "survey@research.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e081",
            "createdAt": 1697005053000,
            "subject": "Holiday Discounts Coming Soon!",
            "body": "Get ready for our upcoming holiday discounts starting next week!",
            "isRead": false,
            "sentAt": 1697018653000,
            "removeAt": null,
            "name": "Marketing Team",
            "isStar": true,
            "from": "offers@holiday.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e082",
            "createdAt": 1697021053000,
            "subject": "Get Your Exclusive Holiday Gift!",
            "body": "As a valued customer, you’re eligible for an exclusive holiday gift!",
            "isRead": false,
            "sentAt": 1697034653000,
            "removeAt": null,
            "name": "Gifts Team",
            "isStar": true,
            "from": "gifts@holiday.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e083",
            "createdAt": 1697034253000,
            "subject": "Thank You for Your Feedback!",
            "body": "We appreciate your feedback. Here’s what we’ve improved.",
            "isRead": true,
            "sentAt": 1697047853000,
            "removeAt": null,
            "name": "Customer Service",
            "isStar": false,
            "from": "thankyou@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e084",
            "createdAt": 1697050853000,
            "subject": "Join Our Loyalty Program!",
            "body": "Sign up now to enjoy exclusive benefits and rewards!",
            "isRead": true,
            "sentAt": 1697064453000,
            "removeAt": null,
            "name": "Loyalty Team",
            "isStar": true,
            "from": "loyalty@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e085",
            "createdAt": 1697068253000,
            "subject": "Exciting Changes to Our Service!",
            "body": "We’re making changes to improve your experience. Stay tuned!",
            "isRead": false,
            "sentAt": 1697081853000,
            "removeAt": null,
            "name": "Updates Team",
            "isStar": false,
            "from": "updates@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e086",
            "createdAt": 1697081053000,
            "subject": "Your Feedback is Important!",
            "body": "Share your thoughts and help us improve!",
            "isRead": false,
            "sentAt": 1697094653000,
            "removeAt": null,
            "name": "Feedback Team",
            "isStar": true,
            "from": "feedback@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e087",
            "createdAt": 1697094653000,
            "subject": "Thank You for Your Subscription!",
            "body": "We’re glad to have you with us. Here’s what you can expect.",
            "isRead": false,
            "sentAt": 1697108253000,
            "removeAt": null,
            "name": "Sales Team",
            "isStar": true,
            "from": "sales@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e088",
            "createdAt": 1697113253000,
            "subject": "We’ve Missed You!",
            "body": "It’s been a while! Here’s a special offer to welcome you back.",
            "isRead": true,
            "sentAt": 1697126853000,
            "removeAt": null,
            "name": "Marketing Team",
            "isStar": false,
            "from": "welcome@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e089",
            "createdAt": 1697120453000,
            "subject": "Your Account is Secure!",
            "body": "We take your security seriously. Here are the latest updates.",
            "isRead": false,
            "sentAt": 1697134053000,
            "removeAt": null,
            "name": "Security Team",
            "isStar": true,
            "from": "security@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e090",
            "createdAt": 1697131453000,
            "subject": "Don’t Forget Your Special Offer!",
            "body": "Your special offer is waiting for you. Don’t miss out!",
            "isRead": false,
            "sentAt": 1697145053000,
            "removeAt": null,
            "name": "Promotions Team",
            "isStar": true,
            "from": "promotions@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e091",
            "createdAt": 1697141453000,
            "subject": "Exclusive Access for You!",
            "body": "You’ve been chosen for exclusive access to our new service.",
            "isRead": false,
            "sentAt": 1697155053000,
            "removeAt": null,
            "name": "Tech Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "techteam@service.com"
        },
        {
            "id": "e092",
            "createdAt": 1697152253000,
            "subject": "We Want to Hear from You!",
            "body": "Please take our survey for a chance to win a gift card.",
            "isRead": true,
            "sentAt": 1697165853000,
            "removeAt": null,
            "name": "Research Team",
            "isStar": false,
            "from": "research@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e093",
            "createdAt": 1697162253000,
            "subject": "Thank You for Your Loyalty!",
            "body": "We appreciate your loyalty and have a special offer for you.",
            "isRead": true,
            "sentAt": 1697175853000,
            "removeAt": null,
            "name": "Loyalty Team",
            "isStar": true,
            "from": "loyalty@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e094",
            "createdAt": 1697172253000,
            "subject": "You’ve Earned a Reward!",
            "body": "Thank you for being with us! Here’s a reward for you.",
            "isRead": false,
            "sentAt": 1697185853000,
            "removeAt": null,
            "name": "Rewards Team",
            "isStar": true,
            "from": "rewards@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e095",
            "createdAt": 1697182253000,
            "subject": "We’re Here to Help!",
            "body": "If you have any questions, our team is here to help.",
            "isRead": true,
            "sentAt": 1697195853000,
            "removeAt": null,
            "name": "Customer Support",
            "isStar": false,
            "from": "support@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e096",
            "createdAt": 1697192253000,
            "subject": "Exciting New Features!",
            "body": "Check out our exciting new features that will enhance your experience.",
            "isRead": false,
            "sentAt": 1697205853000,
            "removeAt": null,
            "name": "Updates Team",
            "isStar": true,
            "from": "updates@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e097",
            "createdAt": 1697202253000,
            "subject": "Exclusive Deals for You!",
            "body": "We have exclusive deals just for our valued customers.",
            "isRead": true,
            "sentAt": 1697215853000,
            "removeAt": null,
            "name": "Promotions Team",
            "isStar": false,
            "from": "promotions@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e098",
            "createdAt": 1697212253000,
            "subject": "Get Ready for Our Upcoming Events!",
            "body": "Prepare for our exciting upcoming events and promotions!",
            "isRead": false,
            "sentAt": 1697225853000,
            "removeAt": null,
            "name": "Events Team",
            "isStar": true,
            "from": "events@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e099",
            "createdAt": 1697222253000,
            "subject": "Thank You for Being a Valued Customer!",
            "body": "We appreciate your loyalty and have special offers for you.",
            "isRead": true,
            "sentAt": 1697235853000,
            "removeAt": null,
            "name": "Loyalty Team",
            "isStar": false,
            "from": "loyalty@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e100",
            "createdAt": 1697232253000,
            "subject": "You’re Invited to Our Exclusive Webinar!",
            "body": "Join us for our exclusive webinar on product features.",
            "isRead": false,
            "sentAt": 1697245853000,
            "removeAt": null,
            "name": "Webinar Team",
            "isStar": true,
            "from": "webinar@service.com",
            "to": "user@appsus.com"
        }, {
            "id": "e116",
            "createdAt": 1697257253000,
            "subject": "Feedback on Your Recent Purchase",
            "body": "We would love to hear your thoughts on your recent purchase!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "User Feedback",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "support@service.com"
        },
        {
            "id": "e117",
            "createdAt": 1697258253000,
            "subject": "Invitation to Our Exclusive Webinar",
            "body": "Join us for an exclusive webinar on our latest features.",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Webinar Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "webinar@service.com"
        },
        {
            "id": "e118",
            "createdAt": 1697259253000,
            "subject": "Thank You for Your Support!",
            "body": "We appreciate your continued support and loyalty.",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Appreciation Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "support@service.com"
        },
        {
            "id": "e119",
            "createdAt": 1697260253000,
            "subject": "Suggestions for Improvement",
            "body": "We welcome any suggestions you have for improving our services.",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Feedback Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "feedback@service.com"
        },
        {
            "id": "e120",
            "createdAt": 1697261253000,
            "subject": "Your Experience Matters to Us",
            "body": "Share your experience with us to help us serve you better.",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Customer Care",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "care@service.com"
        },
        {
            "id": "e121",
            "createdAt": 1697262253000,
            "subject": "We Value Your Opinion",
            "body": "Participate in our survey and help shape our future!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Research Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "research@service.com"
        },
        {
            "id": "e122",
            "createdAt": 1697263253000,
            "subject": "Join Us in Our Next Community Event",
            "body": "We’re hosting a community event and would love for you to join!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Community Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "community@service.com"
        },
        {
            "id": "e123",
            "createdAt": 1697264253000,
            "subject": "Your Feedback on Our New Features",
            "body": "Let us know what you think about our new features!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Updates Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "updates@service.com"
        },
        {
            "id": "e124",
            "createdAt": 1697265253000,
            "subject": "Exciting News Coming Up!",
            "body": "We have some exciting news to share with you soon!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "News Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "news@service.com"
        },
        {
            "id": "e125",
            "createdAt": 1697266253000,
            "subject": "Invitation to Share Your Story",
            "body": "We would love to hear your story and feature it in our newsletter.",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Editorial Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "editorial@service.com"
        },
        {
            "id": "e126",
            "createdAt": 1697267253000,
            "subject": "Updates on Your Recent Inquiry",
            "body": "We’re following up on your recent inquiry. Stay tuned!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Support Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "support@service.com"
        },
        {
            "id": "e127",
            "createdAt": 1697268253000,
            "subject": "Your Membership Renewal Reminder",
            "body": "Don’t forget, your membership will renew soon!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Membership Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "membership@service.com"
        },
        {
            "id": "e128",
            "createdAt": 1697269253000,
            "subject": "Let’s Collaborate on a Project!",
            "body": "We’re excited to explore collaboration opportunities with you.",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Collaboration Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "collaborate@service.com"
        },
        {
            "id": "e129",
            "createdAt": 1697270253000,
            "subject": "Your Opinion on Our Service is Important",
            "body": "Share your opinion and help us improve our service!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Feedback Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "feedback@service.com"
        },
        {
            "id": "e130",
            "createdAt": 1697271253000,
            "subject": "Special Offers Just for You",
            "body": "Check out these special offers available exclusively to you!",
            "isRead": false,
            "sentAt": null,
            "removeAt": null,
            "name": "Offers Team",
            "isStar": true,
            "from": "user@appsus.com",
            "to": "offers@service.com"
        }, {
            "id": "e131",
            "createdAt": 1697272253000,
            "subject": "Your Feedback is Valuable!",
            "body": "We would love to hear your thoughts on our recent updates.",
            "isRead": false,
            "sentAt": 1697273253000,
            "removeAt": 1697274253000,
            "name": "Feedback Team",
            "isStar": true,
            "from": "support@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e132",
            "createdAt": 1697273253000,
            "subject": "Your Subscription Renewal Notice",
            "body": "Just a reminder that your subscription will renew soon.",
            "isRead": false,
            "sentAt": 1697274253000,
            "removeAt": 1697275253000,
            "name": "Subscription Team",
            "isStar": true,
            "from": "updates@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e133",
            "createdAt": 1697274253000,
            "subject": "Join Us for a Special Event",
            "body": "You’re invited to a special event this month!",
            "isRead": false,
            "sentAt": 1697275253000,
            "removeAt": 1697276253000,
            "name": "Events Team",
            "isStar": true,
            "from": "events@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e134",
            "createdAt": 1697275253000,
            "subject": "Thank You for Your Recent Purchase!",
            "body": "We appreciate your purchase and hope you love your new item!",
            "isRead": false,
            "sentAt": 1697276253000,
            "removeAt": 1697277253000,
            "name": "Sales Team",
            "isStar": true,
            "from": "sales@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e135",
            "createdAt": 1697276253000,
            "subject": "Exciting Features Coming Your Way!",
            "body": "Stay tuned for new features that will enhance your experience.",
            "isRead": false,
            "sentAt": 1697277253000,
            "removeAt": 1697278253000,
            "name": "Product Team",
            "isStar": true,
            "from": "updates@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e136",
            "createdAt": 1697277253000,
            "subject": "We Want Your Opinion!",
            "body": "Participate in our survey for a chance to win prizes.",
            "isRead": false,
            "sentAt": 1697278253000,
            "removeAt": 1697279253000,
            "name": "Research Team",
            "isStar": true,
            "from": "research@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e137",
            "createdAt": 1697278253000,
            "subject": "Your Special Offer Awaits!",
            "body": "Don’t miss out on this exclusive offer just for you.",
            "isRead": false,
            "sentAt": 1697279253000,
            "removeAt": 1697280253000,
            "name": "Promotions Team",
            "isStar": true,
            "from": "offers@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e138",
            "createdAt": 1697279253000,
            "subject": "We Appreciate Your Loyalty!",
            "body": "Thank you for being a loyal customer. Here’s a gift for you!",
            "isRead": false,
            "sentAt": 1697280253000,
            "removeAt": 1697281253000,
            "name": "Loyalty Team",
            "isStar": true,
            "from": "loyalty@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e139",
            "createdAt": 1697280253000,
            "subject": "Join Our Community for Exclusive Benefits",
            "body": "Become a member of our community for exclusive perks.",
            "isRead": false,
            "sentAt": 1697281253000,
            "removeAt": 1697282253000,
            "name": "Community Team",
            "isStar": true,
            "from": "community@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e140",
            "createdAt": 1697281253000,
            "subject": "Your Insights Matter!",
            "body": "Share your thoughts with us and help us improve.",
            "isRead": false,
            "sentAt": 1697282253000,
            "removeAt": 1697283253000,
            "name": "Customer Care",
            "isStar": true,
            "from": "care@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e141",
            "createdAt": 1697282253000,
            "subject": "Exciting News on Our Services!",
            "body": "Stay updated on the exciting news regarding our services.",
            "isRead": false,
            "sentAt": 1697283253000,
            "removeAt": 1697284253000,
            "name": "Updates Team",
            "isStar": true,
            "from": "updates@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e142",
            "createdAt": 1697283253000,
            "subject": "Thank You for Joining Us!",
            "body": "We appreciate you joining our community. Here’s what to expect.",
            "isRead": false,
            "sentAt": 1697284253000,
            "removeAt": 1697285253000,
            "name": "Welcome Team",
            "isStar": true,
            "from": "welcome@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e143",
            "createdAt": 1697284253000,
            "subject": "A Reminder About Your Account",
            "body": "Just a friendly reminder regarding your account details.",
            "isRead": false,
            "sentAt": 1697285253000,
            "removeAt": 1697286253000,
            "name": "Account Team",
            "isStar": true,
            "from": "account@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e144",
            "createdAt": 1697285253000,
            "subject": "Exciting Promotions Coming Up!",
            "body": "Get ready for some exciting promotions coming your way!",
            "isRead": false,
            "sentAt": 1697286253000,
            "removeAt": 1697287253000,
            "name": "Promotions Team",
            "isStar": true,
            "from": "promotions@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e145",
            "createdAt": 1697286253000,
            "subject": "We Value Your Feedback!",
            "body": "Your feedback is essential for us to improve our services.",
            "isRead": false,
            "sentAt": 1697287253000,
            "removeAt": 1697288253000,
            "name": "Feedback Team",
            "isStar": true,
            "from": "feedback@service.com",
            "to": "user@appsus.com"
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
        sentAt: null,
        removeAt: null,
        name: loggedUser.fullName,
        isStar: false,
        from: loggedUser.email,
        to
    }
}