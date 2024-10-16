const { Link } = ReactRouterDOM;

export function Home() {
    return (
        <section className="home">
            <nav>
                <Link to="/note">
                    <img src="assets/css/apps/note/note-svgs/icons8-google-keep.svg" alt="" />
                </Link>
                <Link to="/mail/inbox">
                    <img src="assets/css/apps/mail/mail-svgs/icons8-gmail.svg" alt="" />
                </Link>
            </nav>
        </section>
    );
}