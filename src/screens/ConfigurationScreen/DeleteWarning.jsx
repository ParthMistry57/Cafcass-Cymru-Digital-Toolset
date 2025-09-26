import React from 'react'
import Button from '../../components/button'
import { useTranslation } from 'react-i18next';
import './DeleteWarning.css'
import { btnPinkLarge } from '../../assets/images/ui';
import { useSpring, animated } from '@react-spring/web';

function DeleteWarning({onStateChange, className}) {
    const { t, i18n } = useTranslation(); // Hook for translation functions
    const [fade, api] = useSpring(
        () => ( {
            //Animation plays on load
            from: {opacity: 0},
            to: {opacity: 1},
            config: {duration: 500},
            reset: false
        }), [])
    const clickYes = () => {
        api.start({
            //Animation plays on load
            from: {opacity: 1},
            to: {opacity: 0},
            config: {duration: 500},
            reset: false,
            onRest: () => onStateChange(true)
        })
    }
    const clickNo = () => {
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
        <animated.div className={`delete-warning-wrapper ${className}`} style={fade}>
            <div className='delete-warning-bg'></div>
            <div className='delete-warning-container'>
                <h1 className='delete-warning-text'>{t("delete_data_warning")}</h1>
                <div className='delete-warning-btn-wrapper'>
                    <Button text={t("No")} image={btnPinkLarge} onClick={clickNo}></Button>
                    <Button text={t("Yes")} onClick={clickYes}></Button>
                </div>
            </div>
        </animated.div>
  )
}

export default DeleteWarning