import React, {useState, useEffect} from 'react'
import CustomSlider from './CustomSlider';
import * as sliderAssets from '../../assets/images/sliders';
import './SliderIcon.css'
import { clickSound, popSound } from '../../assets/audio';

function SavedSliders({slider, onDelete, tkey, disableClick = false}) {
    const [isClicked, setClicked] = useState(false)
    const toggleClicked = () =>{
        clickSound.play();
        if (disableClick) return
        setClicked(!isClicked)
    }
    const clickDelete = () =>{
        popSound.play()
        onDelete(tkey)
    }

    // if (!slider) return (<h3 className='saved-sliders-message'> There are currently no saved sliders </h3>)
    
    let leftAsset, rightAsset;
    if (slider.markType == 2) {
        leftAsset = sliderAssets.faceStep1;
        rightAsset = sliderAssets.faceStep5;
    } else if (slider.markType == 3) {
        leftAsset = sliderAssets.checkMarkStep1;
        rightAsset = sliderAssets.checkMarkStep2;
    }

    function bgGradient(trackColor, trackType) {
        if (trackType==1) {
            return {background: "linear-gradient(0.25turn,"+trackColor[0]+","+trackColor[1]+","+trackColor[2]+")"}
        } else {
            return {background: trackColor[2]}
        }
    }

    

    return (
        <div className='sliderIcon'>
            {!isClicked ? "" : <div className='deleteSlider' onClick={clickDelete}>X</div>}
            {slider.markType==1 ? <div className="sliderIconNumber" onMouseDown={toggleClicked}>0</div> : <img onMouseDown={toggleClicked} src={leftAsset} alt="" />}
            <div className='sliderIconBar' onMouseDown={toggleClicked} style={bgGradient(slider.trackColor, slider.trackType)}></div>
            {slider.markType==1 ? <div onMouseDown={toggleClicked} className="sliderIconNumber">{slider.steps}</div> : <img onMouseDown={toggleClicked} src={rightAsset} alt="" />}
        </div>
        // <div>
        //     { Object.keys(sliders).map((key) => {
        //         return renderSliderAsIcon({trackColor: [0,0,"red"]})
        //     })}

        // </div>
    )
}

export default SavedSliders