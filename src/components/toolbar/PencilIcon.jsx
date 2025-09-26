import React from 'react'
import { pencilBlack } from '../../assets/images/drawing'

function PencilIcon({src = pencilBlack, disabled = false, onClick, value=0}) {
  return (
    <button className='pencilIcon' disabled={disabled} onClick={onClick}>
        <img src={src} title={value}/>
    </button>
  )
}

export default PencilIcon