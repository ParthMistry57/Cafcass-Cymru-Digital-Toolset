import buttonClick from './button_click.wav'
import pop from './pop.wav'
import wand from './wand.wav'
import woosh from './woosh.wav'

//Volume controller
const VOLUME = 0.1

//Audio objects
const clickSound = new Audio(buttonClick)
const popSound = new Audio(pop)
const wandSound = new Audio(wand)
const wooshSound = new Audio(woosh)

//Sets the volume
clickSound.volume = VOLUME
popSound.volume = VOLUME
wandSound.volume = VOLUME
wooshSound.volume = VOLUME

//Exports
export {
    clickSound,
    popSound,
    wandSound,
    wooshSound
}