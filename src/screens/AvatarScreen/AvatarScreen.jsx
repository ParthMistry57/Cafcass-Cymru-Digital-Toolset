import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../i18n';
import './AvatarScreen.css';
import { clickSound } from '../../assets/audio';
import { heads, torsos, legs } from '../../assets/images/avatar';
import Button from '../../components/button';
import { bottomWave, btnPinkLarge } from '../../assets/images/ui';
import { useSpring, animated } from '@react-spring/web';
import DisplayUserAvatar from './DisplayUserAvatar';
import Screens from '../../modules/Screens';
import { DF_AVATAR } from '../../lib/globals';

function AvatarScreen({selectedLanguage}) {
    /* Screen that allows the user to select their avatar and name */
    const { t } = useTranslation(); // Hook for translation functions
    const navigate = useNavigate(); // Hook for navigation

    //Username variables
    const [username, setUsername] = useState("");
    const usernameChange = (event) => {
        // Triggered when the user types their username in the input field
        setUsername(event.target.value)
    }
    const [usernameError, setUsernameError] = useState(false) //State for when the name is invalid
    const [nameError, nameErrorApi] = useSpring(() => ({ from: {rotate: 0}}), []) //Animation API for the username error
    function triggerUsernameError() { //Triggers animation for username errors
        nameErrorApi.start({
            to: [ {rotate: 2}, {rotate: -2 }, {rotate: 2}, {rotate: -2 }, {rotate: 0} ],
            config: {duration: 100},
            reset: true     
        })
        setUsernameError(true)
    }

    
    //Avatar variables
    const [avatar, setAvatar] = useState(JSON.parse(localStorage.getItem('avatar')) || DF_AVATAR)
    
    //Max length of assets of each type, for cycling through
    const assetsLengths = { 
        head: Object.values(heads).length, 
        torso: Object.values(torsos).length, 
        legs: Object.values(legs).length
    }
    const nextAsset = (event) => {
        /* Changes to next asset, which asset to cycle through is determined by the value in the element that call this */
        clickSound.play()   
        let nextValue = avatar[event.target.value] + 1
        if (nextValue >= assetsLengths[event.target.value]) { //Loops around
            nextValue = 0      
        }
        avatar[event.target.value] = nextValue
        setAvatar({head: avatar.head, torso: avatar.torso, legs: avatar.legs})
    }

    const previousAsset = (event) => {
        /* Changes to previous asset, which asset to cycle throuhg is determined by the value in the element that call this */
        clickSound.play()
        let nextValue = avatar[event.target.value] - 1
        if (nextValue < 0) { //Cannot be below 0, loops around
            nextValue = assetsLengths[event.target.value] - 1      
        }
        avatar[event.target.value] = nextValue
        setAvatar({head: avatar.head, torso: avatar.torso, legs: avatar.legs})
    } 
    const randomGeneration = () => {
        /* Randomly generates values for head, torso and legs and swaps the assets */
        clickSound.play()
        avatar.head = Math.floor(Math.random() * assetsLengths.head)
        avatar.torso = Math.floor(Math.random() * assetsLengths.torso)
        avatar.legs = Math.floor(Math.random() * assetsLengths.legs)
        setAvatar({head: avatar.head, torso: avatar.torso, legs: avatar.legs})
    }

    function isValidName(name) {
        // Define a regular expression pattern for name validation.
        const pattern = /^[a-z ,.'-]+$/i;
        return pattern.test(name);
    }

    const [isShowing, setShowing] = useState(false); // State that controls visibility of the avatar confirmation popup
    const [fadeAnimation, api] = useSpring(() => ( {config: {duration: 500}}), [] ) //Animation hook for confirmation pop fade in/out

    const toggleShowing = () => {
        /* Toggles the confirmation screen on and off */
        clickSound.play();
        if (!isValidName(username)) {
            // Valid name?
            triggerUsernameError();
        } else {
            setAvatar({...avatar, ...{name: username}})
            api.start({
                from: {opacity: 0}, 
                to: {opacity:1 }, 
                onStart : ()=> setShowing(true) 
            })
        }
    };

    const handleOnClickConfirm = () => {
        /* Handles user clickign the confirm button */
        clickSound.play()
        localStorage.setItem('avatar', JSON.stringify(avatar)); // Saving avatar data to localStorage
        //Finds which page is enabled and goes to it next
        let nextPage = Screens.next().url
        navigate(nextPage, { state: { avatar } });
    }

    const handleOnClickBack = () => {
        /* Handles user clickign the back button */
        api.start({
            from: {opacity: 1},
             to: {opacity: 0 }, 
             onRest : ()=> setShowing(false)
        })
    }

    
    

    return (
        <div className='avatar-page-wrapper'>
            <animated.div className="avatar-confirmation-screen" style={{display: isShowing ? "grid" : "none", ...fadeAnimation } }>
                <div className="avatar-confirmation">
                    <div className="avatar-confirm-name">
                        <h1>{avatar.name}</h1>
                    </div>
                    <div className="avatar-confirm-icon">
                        <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs}/> 
                    </div>
                    <div className="avatar-confirm-btns">
                        <button className="confirmation-btn" onClick={handleOnClickBack}>{t("return_btn")}</button>
                        <button className="confirmation-btn" onClick={handleOnClickConfirm}>{t("confirm_btn")}</button>
                    </div>    
                </div>
            </animated.div>

            <div className="avatar-header">
                <svg id="topwave" viewBox="-1 -1 400 100">
                    <path d="M 0 0 Q 29 29 51 35 Q 211 74 350 35 Q 376 30 400 0"></path>
                    <text x="205" y="32">{t('Screen_Avatar_title')}</text>
                </svg>
                <svg id="topwave_shadow" viewBox="-1 -1 440 100">
                    <path d="M 0 0 Q 50 45 71 55 Q 231 94 370 55 Q 396 50 440 0"></path>
                </svg>
            </div>

            <div className="avatar-main">
                <div className="avatar-name">
                    <h1>{t('Screen_Avatar_name_header')}</h1>
                    <animated.label style={nameError}>
                        <input type="text" name='Your Name' placeholder={t('Screen_Avatar_name_placeholder')}className={usernameError ?'avatar-input-error' : ""} value={username} onChange={usernameChange}/>
                    </animated.label>
                    <h4 className='avatar-name-error' style={{opacity: usernameError ? 1 : 0}}>{usernameError ? t("Please enter a valid name"): "-"}</h4>
                </div>

                <div className="avatar-selector">
                    <div className="avatar-btns">
                        <button className="avatar-btn" onClick={previousAsset} value={"head"}>{"<"}</button>
                        <button className="avatar-btn" onClick={previousAsset} value={"torso"}>{"<"}</button>
                        <button className="avatar-btn" onClick={previousAsset} value={"legs"}>{"<"}</button>
                    </div>

                    <div className="avatar-display">
                        <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs}/>
                    </div>
                    <div className="avatar-btns">
                        <button className="avatar-btn" onClick={nextAsset} value={"head"}>{">"}</button>
                        <button className="avatar-btn" onClick={nextAsset} value={"torso"}>{">"}</button>
                        <button className="avatar-btn" onClick={nextAsset}value={"legs"}>{">"}</button>
                    </div>
                </div>

                <div className="avatar-bottom-row">
                    <div className="avatar-random-button">
                        <Button onClick={randomGeneration} text={t("randomize_btn")} image={btnPinkLarge}/>
                    </div>
                    <div className="avatar-start-button">
                        <Button onClick={toggleShowing} text={t('start_btn')} />
                    </div>
                </div>

            </div>

            <div className="avatar-bg-footer">
                <img src={bottomWave} id="bottom-wave" alt="Background Wave" />
            </div>
        </div>
    )
}
export default AvatarScreen