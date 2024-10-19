import { RateSelect } from "./RateCmp/RateSelect.jsx"
import { RateStar } from "./RateCmp/RateStart.jsx"
import { RateTextBox } from "./RateCmp/RateTextBox.jsx"


export function RateCmp({ cmpType, onChange, handleRatingChange, rating }) {

    return (
        <section className="rate-cmp">
            <DynamicCmp cmpType={cmpType} onChange={onChange} handleRatingChange={handleRatingChange} rating={rating} />
        </section>
    )
}

function DynamicCmp(props) {
    switch (props.cmpType) {
        case 'select':
            return <RateSelect {...props} />
        case 'textbox':
            return <RateTextBox {...props} />
        case 'stars':
            return <RateStar {...props} />
        default:
            return null;;
    }
}