const { useNavigate } = ReactRouterDOM

export function AppNavigator() {

    const navigate = useNavigate()

    function onClickPage(page) {
        if (page === 'gamil') {
            navigate('/mail/inbox')
        }
        else if (page === 'note') {
            navigate('/note')
        } else {
            navigate('/home')
        }
    }

    return (
        <div className="app-navigator">
            <div onClick={() => onClickPage('home')} className="box">
                <img src="/assets/css/apps/mail/mail-svgs/icons8-home-50(1).png" alt="home" />
                <h4>Home</h4>
            </div>
            <div onClick={() => onClickPage('gmail')} className="box">
                <img src="/assets/css/apps/mail/mail-svgs/icons8-gmail-48.png" alt="gmail" />
                <h4>Gmail</h4>
            </div>
            <div onClick={() => onClickPage('note')} className="box">
                <img src="/assets/css/apps/mail/mail-svgs/icons8-google-keep-new-48.png" alt="keep" />
                <h4>Keep</h4>
            </div>
        </div>
    )
}