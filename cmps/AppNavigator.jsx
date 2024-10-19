const { useNavigate } = ReactRouterDOM


export function AppNavigator({ isHidden }) {

    const navigate = useNavigate()


    function onClickPage(page) {
        if (page === 'gmail') {
            navigate('/mail/inbox')
        }
        else if (page === 'note') {
            navigate('/note')
        } else if (page === 'books') {
            navigate('/books')
        } else {
            navigate('/home')
        }
    }

    const hiddenClass = isHidden ? 'hidden' : ''
    return (
        <div className={`app-navigator ${hiddenClass}`}>
            <div onClick={() => onClickPage('home')} className="box">
                <img src="assets/css/apps/mail/mail-svgs/icons8-home-50(1).png" alt="home" />
                <h4>Home</h4>
            </div>
            <div onClick={() => onClickPage('gmail')} className="box">
                <img src="assets/css/apps/mail/mail-svgs/icons8-gmail-48.png" alt="gmail" />
                <h4>Gmail</h4>
            </div>
            <div onClick={() => onClickPage('note')} className="box">
                <img src="assets/css/apps/mail/mail-svgs/icons8-google-keep-new-48.png" alt="keep" />
                <h4>Keep</h4>
            </div>
            <div onClick={() => onClickPage('books')} className="box">
                <img src="assets/css/apps/mail/mail-svgs/icons8-books-48.png" alt="books" />
                <h4>Books</h4>
            </div>
        </div>
    )
}