export function LongTxt({ txt, length = 100 }) {

    return (
        <React.Fragment>
            {`${txt.substring(0, length)}...`}
        </React.Fragment>

    )
}