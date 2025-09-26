import React, {useState} from 'react'
import { heads, torsos, legs, wands, hats } from '../../assets/images/avatar'
import mergeImages from 'merge-images';
import { isValueInsideRange } from '../../lib/functions';

function DisplayUserAvatar({head = 0, torso=0, leg=0, hat=false, wand=false}) {
    /**  Function is used to display an user avatar.
     * @param {head, torso, leg} index of each asset type to be displayed
     * @param {hat, wand} index for hat and wand assets. Needs both to be present to display!
     * 
    */
   
    head = isValueInsideRange(head, Object.keys(heads).length) ? head : 0
    torso = isValueInsideRange(torso, Object.keys(torso).length) ? torso : 0
    leg = isValueInsideRange(leg, Object.keys(leg).length) ? leg : 0

    if (hat && wand) { 
        //If values for hat and wand are given, check if they are valid
        hat = isValueInsideRange(hat, Object.keys(hat).length+1) ? hat : 1
        wand = isValueInsideRange(wand, Object.keys(wand).length+1) ? wand : 1
    }
    

    const[avatarImg, setAvatarImg] = useState("")
    /**
     * Merges images into a singular image, this allows for the image to be moved around and scaled
     *  while maintaning the position of the assets in relation to each other 
     */
    if (!hat && !wand) {
        mergeImages([
                { src: Object.values(heads)[head], x: 0, y: 0 },
                { src: Object.values(torsos)[torso], x: 10, y: 248 },
                { src: Object.values(legs)[leg], x: 100, y: 416 }
            ], 
            {
                width : 310, 
                height : 600
            })
            .then(b64 => setAvatarImg(b64) )
    } else {
        mergeImages([
            { src: Object.values(heads)[head], x: 0, y: 290 },
            { src: Object.values(torsos)[torso], x: 10, y: 538 },
            { src: Object.values(legs)[leg], x: 100, y: 706 },
            { src: Object.values(hats)[hat-1], x: 80, y: 0 },
            { src: Object.values(wands)[wand-1], x: 195, y: 465 },
        ], 
        {
            width : 330, 
            height : 880
        })
        .then(b64 => setAvatarImg(b64) )
    }
        
    return (
        <div className='avatar-wrapper'>
            <img className='avatar-img' src={avatarImg}/>
        </div>
  )
}

export default DisplayUserAvatar