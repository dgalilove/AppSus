const { useState, useEffect, useRef } = React

export function RateSelect({ onChange, rating }) {

    useEffect(() => {
        console.log(`RateSelect`, `uploaded`)

        return () => {
            console.log(`RateSelect`, `destroyed`)
        }
    }, [])

    return (
        <section className="rate-select">
            <label className='book-review-info-title'>Rating:</label>
            <select name='rating' required={true} onChange={onChange} value={rating}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>



        </section>
    )
}