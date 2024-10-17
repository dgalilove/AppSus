const { Link } = ReactRouterDOM;

export function Home() {
    return (
        <section className="home">
            <nav>
                <div className='header-title'>

                    <h2>App Sus</h2>
                    <h3>Zohar & Daniel</h3>
                </div>
                <div className='apps-nav'>
                    <Link to="/note">
                        <img src="assets/css/apps/note/note-svgs/icons8-google-keep.svg" alt="" />
                    </Link>
                    <Link to="/mail/inbox">
                        <img src="assets/css/apps/mail/mail-svgs/icons8-gmail.svg" alt="" />
                    </Link>
                </div>
                <div className='pixel-char'>
                    <img src="assets/css/apps/note/note-svgs/pixel-daniel.png" alt="" />
                    <img src="assets/css/apps/note/note-svgs/pixel-zohar.png" alt="" />
                </div>
            </nav>
        </section>
    );
}