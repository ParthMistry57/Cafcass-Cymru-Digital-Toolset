import React, {useState, useEffect} from 'react'
import './CustomSlider.css'
import ReactSlider from "react-slider";
import * as sliderAssets from '../../assets/images/sliders';


function CustomSlider({width=400, height=10, trackType=1, markType=1, max=10, trackColor=["#ff0000", "#ffff00", "#008000"], value = max, sizeUnit="px", onStateChange=()=>{}} ){
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(()=>{onStateChange(currentValue)}, [currentValue])

    if (markType === 2 && max === 5) { max = 4 } //For face emoji
    const customMarkRender = (props) => {
        let output = ""
        if (markType === 1) {//Marks for the numbers
            output =  <div className='trackContainer' key={props.key}>
                        <span className={props.className} style={props.style} />
                        <span key={props.key + "-bg"} className={props.className + "-bg"} style={props.style}>{props.key}</span>
                    </div>

        } else if (markType === 2){//Marks for the emojis
            let imgSrc = Math.ceil((props.key) * 5/max);
            if (imgSrc === 0) { imgSrc++ }
            output =  <div className='trackContainer' key={props.key}>
                        <span  className={props.className} style={props.style} />
                        <img src={sliderAssets["faceStep"+ imgSrc]} className={props.className + "-bg-faces"} style={props.style}/>
                    </div>
        } else if (markType === 3){ //Marks for checkmarks
            output =  <div className='trackContainer' key={props.key}>
                        <span className={props.className} style={props.style} />
                        <img src={sliderAssets["checkMarkStep" + (props.key+1)]} className={props.className + "-bg-faces"} style={props.style}/>
                      </div>
        }
        return output
    } 
    return (
            <div className='slider-wrapper' style={{"--width": width+sizeUnit, "--height": height+sizeUnit }}>
                <ReactSlider
                value={currentValue}
                className='customSlider'
                trackClassName='customSlider-track'
                markClassName="customSlider-mark"
                min={0} max={max} marks={1} step={1}
                renderMark={customMarkRender}
                renderTrack={(props)=>{
                    if (props.key === "customSlider-track-0") {
                        if (trackType === 2){
                            props.style = {background: trackColor[2]}
                        } else if (trackType === 1) {
                            props.style = {
                                "--gradientStart": trackColor[0],
                                "--gradientMiddle": trackColor[1],
                                "--gradientEnd": trackColor[2]
                    
                            }
                        }
                    }
                    
                    return <div key={props.key} className={props.className} style={props.style}/>
                }}   
                onAfterChange={(value) => setCurrentValue(value)}
                />
            </div>
  )
}

export default CustomSlider