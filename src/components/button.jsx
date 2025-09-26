import React from 'react'
import './button.css'
import {btnGreen} from '../assets/images/ui'

function Button({text="Next", image=btnGreen, fontSize="2.5rem", href, onClick, scale, disabled=false}) {
  return (
    <div className='btn-wrapper' style={{transform: "scale("+scale+")"}}>
        <img className='btn-img-shadow' src={image} alt="Button Shadow"/>    
        <input type="button" href={href} value={text} onClick={onClick} className='btn' style={
          {
            background: "url(" + image + ") no-repeat", 
            backgroundRepeat : "no-repeat",
            fontSize : fontSize,
            backgroundSize : 'auto' 
          }} disabled={disabled}/>
        {/* <img className='btn-img' src={btnGreen}/>             */}     
    </div>
  )
}

export default Button