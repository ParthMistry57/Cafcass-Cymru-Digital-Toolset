import React from 'react'
import { useTranslation } from 'react-i18next';
import { clickSound } from '../assets/audio';
import "./ConfirmPopup.css"
import Button from './button';
import { btnPinkLarge } from '../assets/images/ui';
import { useSpring, animated } from '@react-spring/web';

function ConfirmPopup({text, onStateChange, visible}) {
const { t } = useTranslation();
if (!text) text = t("This action cannot be undone. Are you sure?");

const [fade, api] = useSpring(
    () => ( {
        //Animation plays on load
        from: {opacity: 0},
        to: {opacity: 1},
        config: {duration: 300},
        reset: false
    }), [])
const clickYes = () => {
    clickSound.play()
    api.start({
        //Animation plays on load
        from: {opacity: 1},
        to: {opacity: 0},
        config: {duration: 300},
        reset: false,
        onRest: () => onStateChange(true)
    })
}
const clickNo = () => {
    clickSound.play()
    api.start({
        //Animation plays on load
        from: {opacity: 1},
        to: {opacity: 0},
        config: {duration: 500},
        reset: false,
        onRest: () => onStateChange(false)
    })
}

  return (
    <animated.div className={`confirm-popup-overlay`} style={fade}>
      <div className="confirm-popup">
        <h2>{t(text)}</h2>
        <div className='confirm-popup-buttons'>
            <Button className="confirm-popup-button" onClick={clickNo} image={btnPinkLarge} text={t("No")}></Button>
            <Button className="confirm-popup-button" onClick={clickYes} text={t("Yes")}></Button>
        </div>
      </div>
    </animated.div>
  )
}

export default ConfirmPopup