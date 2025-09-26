import React, { useState } from 'react'
import { useSpring, animated  } from '@react-spring/web'
import { greenCheckmark } from '../../assets/images/ui'
import { clickSound } from '../../assets/audio';
import { useTranslation } from 'react-i18next';

function ModuleIcon({module={isEnabled: true, name: "default", title: "default", url : '/default', isEnabled: false}, onStateChange}) {
    /**
     * @param color specifies the background colour of the module, use hex or css colour names
     * @param text the text displayed in the box
     * @param selected boolean, when true adds a selected checkbox to the module @todo
     */

    //Sound

    //Handles button press state
    const [pressed, pressButton] = useState(false)
    const [isSelected, setSelected] = useState(module.isEnabled)
    const { t, i18n } = useTranslation(); // Hook for translation functions

    //Handles button press animation
    const [buttonClickAnimation, api] = useSpring(
        () => ( {
            //Animation plays on load
            from: {opacity: 0, rotate: 0, x:0, y:0, height: 0},
            to: {opacity: 1, height: 100},
            config: {duration: 250},
            reset: false
        }), [])
    //Handles button press event    
    const buttonPress = () => {
        clickSound.play()
        if (!module.isImplemented) {
            api.start({
                from: {x: 0, y: 0, rotate: 0},
                to: [{rotate: - 4 }, {rotate: 4}, {rotate: - 4 }, {rotate: 4}, {rotate: 0}],
                config: {duration: 100},
                onResolve: () => {
                    console.log("Module not implemented")
                }
            })
            
        }
        if (!pressed && module.isImplemented) {
            api.start({
                from: {x: 0, y: 0, opacity: 1, height: 100},
                to: async (next) => {
                    await next({ x: 10, y: 10 })
                },
                config: {duration: 100},
                onStart: ()=> {
                    pressButton(true)
                }, //Button is pressed

                onResolve: () => { 
                    //Start second animation, that will fade module out
                    api.start({
                        from: {opacity: 1, height: 100},
                        to: async (next) => {
                            await next({ opacity: 0, height: 0 })
                        },
                        config: {duration: 250},
                        onResolve: () => {
                            setSelected(!isSelected);
                            onStateChange({...module, isEnabled: isSelected})
                    }})                        
                }
                
            })
        }
    }

    return (
        <animated.div id={module.path} className='modules-wrapper' style={buttonClickAnimation}> 
            <input type="button" className='config-module-click' onClick={buttonPress}></input>
            <div className='modules-content'>
                <div className={`config-module-bg ${pressed ? 'no-shadow' : ''} ${module.isImplemented ? '' : 'module-not-enabled'}`} style={{backgroundColor : module.color}}></div>

                {isSelected ? (<img className='config-module-selectArea' src={greenCheckmark} alt={module.name + " icon box"}/>) : (<div className='config-module-selectArea unselected'></div>)}
                
                <h2 className='config-module-text'>{t(module.name)}</h2>
            </div>
        </animated.div>
    )
}

export default ModuleIcon