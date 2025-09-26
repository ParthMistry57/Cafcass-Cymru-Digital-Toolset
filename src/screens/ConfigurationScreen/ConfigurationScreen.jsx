import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ConfigurationScreen.css'
import ModuleIcon from './ModuleIcon';
import Button from '../../components/button';
import { btnPink1, deleteButton } from '../../assets/images/ui';
import { clickSound } from '../../assets/audio';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import Screens from '../../modules/Screens'
import DeleteWarning from './DeleteWarning';

function ConfigurationScreen({ selectedLanguage }) {
    const { t, i18n } = useTranslation(); // Hook for translation functions
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage, i18n]);

    
    const [modules, setModules] = useState({})
    const [userEmail, setUserEmail] = useState("")
    const [isError, setError] = useState(false)
    const [deleteWarning, setDeleteWarning] = useState(false)

    useEffect(() => {
        /** @todo change having to convert to dict, by making the rest of the page use arrays. For now it stays like this */     
        let toDict = {}
        Screens.all.forEach((each) => {
            if (each.isImplemented) toDict[each.name] = each
        })
        Screens.all.forEach((each) => {
            if (!each.isImplemented) toDict[each.name] = each
        })
        setModules(toDict)

        const emailData = localStorage.getItem('userEmail');
        if (emailData) setUserEmail(emailData)

    }, []);
    console.log(modules)
    const changeVisibility = (value) => {
        /** Change which column the module should appear in */
        //Find the matching module in the dictionary (modules)
        let changedModule = Object.keys(modules).find(key => modules[key]["url"] === value.url);
        
        modules[changedModule].isEnabled = !(modules[changedModule].isEnabled)
        
        //Create a temp dictionary with the changed value
        let temp = {}
        temp[changedModule] = modules[changedModule]

        //Delete the original entry, so that we can send it to the end of the list
        // delete modules[changedModule]

        //Add the temp value back into the dictionary (it is now at the end of the list)
        modules[changedModule] = temp[changedModule]
        
        setModules({...modules})

    }
    const updateEmail = (event) => {
        /** Updates the email state when there's new input */
        setUserEmail(event.target.value)
    }
    const [error, api] = useSpring( () => ({from: {x: 0}, to: {rotate: 0}}), []) //Animation setup
    const triggerEmailError = () => {
        /** Animates the input bar if email is wrong */
        api.start({
            from: {x: 0},
            to:  [  {rotate: 2}, {rotate: -2 }, {rotate: 2}, {rotate: -2 }, {rotate: 0} ],
            config: {duration: 100},
            onStart : () => setError(true)
        })
    }

    function isValidEmail(email) {
        // Define a regular expression pattern for email validation.
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    const saveButton = () => {
        clickSound.play()
        if (!isValidEmail(userEmail)) {
            triggerEmailError()
            return
        }
        Screens.save() // Saving modules data to localStorage
        localStorage.setItem('userEmail', userEmail) // Saving email data to localStorage
        navigate('/admin-dashboard', { state: { modules } });
    }
    const clickDeleteButton = () => {
        setDeleteWarning(true)
    }
    const clickOnWarning = (value) => {
        if(value) {
            localStorage.clear()
            alert("All local storage cleared")
            window.location.reload(); //Forces page to reload
        }
        setDeleteWarning(false)
    }

    return (
        <div className='config-wrapper'>
            <div key={deleteWarning} style={deleteWarning ? {display: "block"} : {display: "none"}}>
                <DeleteWarning onStateChange={clickOnWarning}/>
            </div>
            <div className='config-container' key={modules}>
                <h1 className='config-title'>{t("Configuration_Title")}</h1>
                <div className='config-email' key={isError}>
                    <div className='config-email-title'>
                        <h3>{t("Practicioner's Email")}</h3>
                        { isError ? <div className="show-errors config-email-errors">{ t("Please enter a valid email address") }</div> : ""}
                    </div>
                    <label >
                        <animated.input 
                            onChange={updateEmail} value={userEmail} style={error}
                            name="email" type="email" className={`${isError ? "config-email-error-border" : ""} config-email-input`} 
                            placeholder={t("Practicioner's Email")} 
                        />
                    </label>
                </div>
                <div className='config-active-modules config-module-box'>
                    {/* Loads active modules */}
                    { Object.keys(modules).map((key, index) => {
                        if (modules[key].isEnabled) return <ModuleIcon module={modules[key]} onStateChange={changeVisibility} key={modules[key].name + "t"}/>
                        else return ""
                    })}

                </div>
                <div className='config-inactive-modules config-module-box'>
                    {/* Loads inactive modules */}
                    { Object.keys(modules).map((key, index) => {
                            if (!modules[key].isEnabled) return <ModuleIcon module={modules[key]} onStateChange={changeVisibility} key={modules[key].name + "a"}/>
                            else return ""
                        })}
                </div>
                <div className='config-btn'>
                    <Button scale={0.8} image={btnPink1} text={t("Save")} onClick={saveButton}/>
                </div>
                <div className='delete-btn'>
                    <Button scale={1.2} image={deleteButton} text='' onClick={clickDeleteButton}/>
                </div>
                <div className='slider-btn' >
                    <Button scale={1} text={t("Slider Designer")} fontSize={"2em"} onClick={()=>{
                        clickSound.play()
                        navigate("/configuration/slider-designer")
                        }}/>
                </div>
                
            </div>
        </div>
    )
}
export default ConfigurationScreen