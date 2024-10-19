const { useState, useEffect } = React

export function RateStar({ handleRatingChange, rating }) {

    const [selectedRating, setRating] = useState(rating)

    useEffect(() => {
        handleRatingChange(selectedRating)
    }, [selectedRating])

    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => {
                return (
                    <span key={star}
                        className='start'
                        style={{
                            cursor: 'pointer',
                            color: selectedRating >= star ? 'gold' : 'gray',
                            fontSize: `35px`,
                        }}
                        onClick={() => {
                            setRating(star)
                        }}
                    >
                        {' '}
                        ★{' '}
                    </span>
                )
            })}
        </div>
    )
}