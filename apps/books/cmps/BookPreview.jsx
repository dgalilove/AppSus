
export function BookPreview({ book }) {

    const { title, subtitle, listPrice, authors } = book

    return (
        <section className="book-preview">
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
        </section>
    )
}