import React, {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import './SliderDesigner.css'
import CustomSlider from '../../components/slider/CustomSlider'
import Button from '../../components/button'
import { btnPink1 } from '../../assets/images/ui'
import { useNavigate } from 'react-router-dom'
import { clickSound } from '../../assets/audio'
import SliderIcon from '../../components/slider/SliderIcon'

function SliderDesigner({selectedLanguage}){
    const navigate = new useNavigate();
    const { t, i18n } = useTranslation(); // Hook for translation functions
    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage, i18n]);
    const [userSliders, setUserSliders] = useState(JSON.parse(localStorage.getItem('userSliders')) || false);

    const [newSlider, setNewSlider] = useState({
        steps: 10,
        markType: 1,
        trackType: 1,
        trackColor: ["#ff0000", "#ffff00", "#008000"],
        width: 500,
        sizeUnit: "px",
    })
    const setSteps = (event) => {
        setNewSlider({...newSlider, steps: parseInt(event.target.value)})
    }
    const setMarkType = (event) => {
        let value = event.target.value;
        if (value == 1 && newSlider.steps == 1) {
            setNewSlider({...newSlider, markType: parseInt(event.target.value), steps: 2})
        }
        else if (value == 2 && (newSlider.steps == 10 || newSlider.steps == 1)) {
            setNewSlider({...newSlider, markType: parseInt(event.target.value), steps: 5})
        }
        else if (value == 3 ) { setNewSlider({...newSlider, markType: parseInt(event.target.value), steps: 1} ) }
        else { setNewSlider({...newSlider, markType: parseInt(event.target.value)}) }
    }
    const setTrackType = (event) => {
        setNewSlider({...newSlider, trackType: parseInt(event.target.value)})
    }
    const setTrackColor = (event)=> {
        let gradientStep = parseInt(event.target.name.split("-")[1]);
        let newColor = {};
        newColor[0] = newSlider.trackColor[0]
        newColor[1] = newSlider.trackColor[1]
        newColor[2] = newSlider.trackColor[2]
        newColor[gradientStep-1] = event.target.value;
        setNewSlider({...newSlider, trackColor: newColor})
    }
    const resetForm = () => {
        clickSound.play()
        setNewSlider({
            steps: 10,
            markType: 1,
            trackType: 1,
            steps: 5,
            trackColor: ["#ff0000", "#ffff00", "#008000"],
            width: 350,
        })
    }
    const saveButton = () => {
        clickSound.play()
        if (!userSliders) {
            let temp = []
            temp.push(newSlider)
            setUserSliders(temp)    
        } else {
            userSliders.push(newSlider)
            setUserSliders([...userSliders])
        }
        localStorage.setItem("userSliders", JSON.stringify(userSliders))
    }
    const returnButton = () => {
        clickSound.play()
        navigate("/configuration") 
    }

    // useEffect(()=>{
    //     console.log(newSlider)
    // }, [newSlider])
    // useEffect(()=>{
    //     console.log(userSliders)
    // }, [userSliders])
    
    const onDelete = (key) => {
        clickSound.play()
        userSliders.splice(key, 1)
        setUserSliders([...userSliders])
    } 

    return (
        <div className="sliderScreen">
            <h1 className="sc-title">{t("Slider Designer")}</h1>
            <div className="sc-settings">
                <h1 className="sc-list-title">{t("Current Sliders")}</h1>
                <div className="sc-sliders-list">
                    {Object.keys(userSliders).map((key) => {
                        return <SliderIcon key={key} tkey={key} slider={userSliders[key]} onDelete={onDelete}/>
                    })}
                </div>

                <h1 className="sc-new-title">{t("Design a new slider")}</h1>
                <div className="sc-new-sliders">
                    <div className="sc-new-sliders-form-wrapper">
                        <form action="" className='sc-slider-forms'>
                        <div htmlFor="types" className='label-wrapper radio-labels' id='typeRadioForm'>
                                <h4>{t("Type")}</h4>
                                <div>
                                    <label><input name="typeRadio" type="radio" value="1" checked={newSlider.markType === 1 ? true : false} onChange={setMarkType}/>{t("Numbers")}</label>
                                    <label><input name="typeRadio" type="radio" value="2" checked={newSlider.markType === 2 ? true : false} onChange={setMarkType}/>{t("Emojis")}</label>
                                    <label><input name="typeRadio" type="radio" value="3" checked={newSlider.markType === 3 ? true : false} onChange={setMarkType}/>{t("Checkmarks")}</label>
                                </div>
                            </div>
                            <div htmlFor="types" className='radio-labels label-wrapper' id='gradRadioForm'>
                                <h4>{t("Track Colour")}</h4>
                                <div>
                                    <label><input name="gradientRadio" type="radio" value="2" checked={newSlider.trackType === 2 ? true : false}  onChange={setTrackType}/>{t("Single")}</label>
                                    <label><input name="gradientRadio" type="radio" value="1" checked={newSlider.trackType === 1 ? true : false} onChange={setTrackType}/>{t("Gradient")}</label>
                                </div>
                            </div>
                            <div className='radio-labels label-wrapper' id='stepsRadioForm'>
                                <h4>{t("Steps")}</h4>
                                <div>
                                    <label><input name="stepsRadio" type="radio" id="trackSteps1" value="2" checked={newSlider.steps === 2 ? true : false} onChange={setSteps} disabled={newSlider.markType === 3}/>2</label>
                                    <label><input name="stepsRadio" type="radio" id="trackSteps2" value="5" checked={newSlider.steps === 5 ? true : false}  onChange={setSteps} disabled={newSlider.markType === 3}/>5</label>
                                    <label><input name="stepsRadio" type="radio" id="trackSteps3" value="10" checked={newSlider.steps === 10 ? true : false} onChange={setSteps} disabled={newSlider.markType === 2 || newSlider.markType === 3}/>10</label>
                                </div>
                            </div>
                            <label htmlFor="gradColor-1" id='gradient-color' className='label-wrapper'>
                                <h4>{t("Slider Track")} {newSlider.trackType===2 ? "Colour" : "Gradient"}</h4>
                                <div>
                                    {newSlider.trackType===2 ?  "" : <input type="color" name="gradColor-1" id="gradColor-1" onChange={setTrackColor} value={newSlider.trackColor[0]}/>}
                                    {newSlider.trackType===2 ?  "" : <input type="color" name="gradColor-2" id="gradColor-2" onChange={setTrackColor} value={newSlider.trackColor[1]}/>}
                                    <input type="color" name="gradColor-3" id="gradColor-3" onChange={setTrackColor} value={newSlider.trackColor[2]}/>
                                </div>
                            </label>
                        </form>
                        <div className="reset-btn-div">
                            <Button onClick={resetForm} text={t('Reset')}/>   
                        </div>
                    </div>  
                    <div className="sc-slider-result">
                        <h4>{t("New Slider Preview")}</h4>
                        <CustomSlider width={newSlider.width} markType={newSlider.markType} trackType={newSlider.trackType} trackColor={newSlider.trackColor} max={newSlider.steps}/>
                    </div>
                    <div className="save-slider-btn">
                        <Button image={btnPink1} text={t('Save')} onClick={saveButton}/>
                    </div>
                </div>  
            </div>
            <div className="saveBtn">
                <Button image={btnPink1} text={t('Return')} onClick={returnButton} fontSize='2em'/>
            </div>   
        </div>
  )
}

export default SliderDesigner