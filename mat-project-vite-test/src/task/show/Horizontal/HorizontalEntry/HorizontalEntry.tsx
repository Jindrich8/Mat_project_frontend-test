import { HorizontalEntryCmp, HorizontalEntryCmpProps } from "./HorizontalEntryCmp";

const renderHorizontalEntry = (entry:HorizontalEntryCmpProps) => {
    return <HorizontalEntryCmp 
    resources={entry.resources} 
    exercise={entry.exercise} 
    order={entry.order}
    num={entry.num}/>
}

export {renderHorizontalEntry};