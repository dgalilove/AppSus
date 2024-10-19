
export function ReviewList({ reviews }) {

    return (
        <section className="review-list">
            {reviews.map(review => {
                console.log(review)
                return (
                    <div key={review.id}>
                        <p>{review.review}</p>
                        <div>
                            <h5> by. {review.fullname}</h5>
                            <h5>{'⭐️'.repeat(+review.rating)}</h5>
                            <h5>{review.readAt}</h5>
                        </div>

                    </div>
                )
            })}
        </section>
    )
}