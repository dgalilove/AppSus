
export function RateTextBox({ onChange, rating }) {

    return (
        <section className="rate-text-box">
            <label className='book-review-info-title'>Rating:</label>
            <input
                type='number'
                min={1}
                max={5}
                name='rating'
                onChange={onChange}
                required={true}
                value={rating}
            />
        </section>
    )
}