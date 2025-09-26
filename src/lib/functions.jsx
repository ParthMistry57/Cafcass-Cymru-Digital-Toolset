export function isValueInsideRange(value, max = 0, min = 0){
    /**
     * @param value the number value to be evaluated
     * @param max the maximum value allowed, default 0
     * @param min the minimum value allowed, default 0
     * 
     * @returns true when (min < value < max)
     * 
     */
    if ( typeof value != 'number' ) {
        console.warn("Invalid param, not a number")
        return false
    } else if ( (value >= max) && (max !== 0) ) {
        console.warn("Invalid param, index is too high")
        return false
    } else if ( value < 0 && (max !== 0))  {
        console.warn("Invalid param, index is too low")
        return false
    } else {
        return true
    }
} 