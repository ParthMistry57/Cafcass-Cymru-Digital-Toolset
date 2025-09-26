// import emoji stickers
import happyIcon from './icons/emoji/happy1.png';
import superhappyIcon from './icons/emoji/happy2.png';
import angryIcon from './icons/emoji/angry.png';
import cryIcon from './icons/emoji/cry.png';
import laughIcon from './icons/emoji/laugh.png';
import smile1Icon from './icons/emoji/smile1.png';
import smile2Icon from './icons/emoji/smile2.png';
import unhappyIcon from './icons/emoji/unhappy1.png';
import superunhappyIcon from './icons/emoji/unhappy2.png';
import okIcon from './icons/emoji/ok.png';
import shockedIcon from './icons/emoji/shocked.png';
import badIcon from './icons/emoji/bad.png';

// import people stickers
import people1Icon from './icons/people/people1.png';
import people2Icon from './icons/people/people2.png';
import people3Icon from './icons/people/people3.png';
import people4Icon from './icons/people/people4.png';
import people5Icon from './icons/people/people5.png';
import people6Icon from './icons/people/people6.png';
import people7Icon from './icons/people/people7.png';
import people8Icon from './icons/people/people8.png';
import people9Icon from './icons/people/people9.png';
import people10Icon from './icons/people/people10.png';
import people11Icon from './icons/people/people11.png';
import people12Icon from './icons/people/people12.png';
import people13Icon from './icons/people/people13.png';
import people14Icon from './icons/people/people14.png';
import people15Icon from './icons/people/people15.png';
import people16Icon from './icons/people/people16.png';
import people17Icon from './icons/people/people17.png';
import people18Icon from './icons/people/people18.png';
import people19Icon from './icons/people/people19.png';
import people20Icon from './icons/people/people20.png';
import people21Icon from './icons/people/people21.png';
import people22Icon from './icons/people/people22.png';
import people23Icon from './icons/people/people23.png';
import people24Icon from './icons/people/people24.png';
import people25Icon from './icons/people/people25.png';
import people26Icon from './icons/people/people26.png';
import people27Icon from './icons/people/people27.png';
import people28Icon from './icons/people/people28.png';
import people29Icon from './icons/people/people29.png';
import people30Icon from './icons/people/people30.png';
import people31Icon from './icons/people/people31.png';
import people32Icon from './icons/people/people32.png';
import people33Icon from './icons/people/people33.png';
import people34Icon from './icons/people/people34.png';
import people35Icon from './icons/people/people35.png';
import people36Icon from './icons/people/people36.png';
import people37Icon from './icons/people/people37.png';
import people38Icon from './icons/people/people38.png';
import people39Icon from './icons/people/people39.png';
import people40Icon from './icons/people/people40.png';
import people41Icon from './icons/people/people41.png';
import people42Icon from './icons/people/people42.png';
import people43Icon from './icons/people/people43.png';
import people44Icon from './icons/people/people44.png';
import people45Icon from './icons/people/people45.png';
import people46Icon from './icons/people/people46.png';
import people47Icon from './icons/people/people47.png';
import people48Icon from './icons/people/people48.png';
import people49Icon from './icons/people/people49.png';
import people50Icon from './icons/people/people50.png';

// import animals stickers
import dogIcon from './icons/animals/dog.png';
import catIcon from './icons/animals/cat.png';
import fishIcon from './icons/animals/fish.png';
import lizardIcon from './icons/animals/lizard.png';
import pigIcon from './icons/animals/pig.png';
import rabbitIcon from './icons/animals/rabbit.png';
import rat1Icon from './icons/animals/rat1.png';
import rat2Icon from './icons/animals/rat2.png';
import rat3Icon from './icons/animals/rat3.png';
import snakeIcon from './icons/animals/snake.png';

// import buildings stickers
import cafeIcon from './icons/buildings/cafe.png';
import castleIcon from './icons/buildings/castle.png';
import courtIcon from './icons/buildings/court.png';
import house1Icon from './icons/buildings/house1.png';
import house2Icon from './icons/buildings/house2.png';
import house3Icon from './icons/buildings/house3.png';
import house4Icon from './icons/buildings/house4.png';
import house5Icon from './icons/buildings/house5.png';
import parkIcon from './icons/buildings/park.png';
import pubIcon from './icons/buildings/pub.png';
import schoolIcon from './icons/buildings/school.png';
import sportcenterIcon from './icons/buildings/sportcenter.png';

// import pencil pictures
import * as pencilIcons from '../../assets/images/drawing'
const allPencils = []
Object.keys(pencilIcons).map((key) => {allPencils.push({key: key, value: pencilIcons[key]})})
const pencilColors = [
  "black",
  "blue",
  "brown",
  "cyan",
  "darkgreen",
  "grey",
  "green",
  "orange",
  "pink",
  "purple",
  "red",
  "white",
  "yellow"

]



// import sliders
const DEFAULT_SLIDERS = [{
  steps: 10,
  markType: 1,
  trackType: 1,
  trackColor: ["#ff0000", "#ffff00", "#008000"],
  width: 500,
  sizeUnit: "px",
}, {
  steps: 5,
  markType: 2,
  trackType: 1,
  trackColor: ["#ff0000", "#ffff00", "#008000"],
  width: 500,
  sizeUnit: "px",
}, {
  steps: 1,
  markType: 3,
  trackType: 2,
  trackColor: ["#ff0000", "#ffff00", "#008000"],
  width: 500,
  sizeUnit: "px",
}] // add default sliders here
const sliders = DEFAULT_SLIDERS.concat(JSON.parse(localStorage.getItem("userSliders")) || []) 

const tools = {
    'Stickers': [],
    'Category2': allPencils,
    'PostIt': ['Tool3-1', 'Tool3-2', 'Tool3-3'],
    'Sliders': sliders,
    'Emoji': [
      { id: 1, name: 'angry', icon: angryIcon }, 
      { id: 2, name: 'unhappy', icon: unhappyIcon }, 
      { id: 3, name: 'smile1', icon: smile1Icon },
      { id: 4, name: 'cry', icon: cryIcon }, 
      { id: 5, name: 'laugh', icon: laughIcon }, 
      { id: 6, name: 'happy', icon: happyIcon }, 
      { id: 7, name: 'superhappy', icon: superhappyIcon }, 
      { id: 8, name: 'ok', icon: okIcon }, 
      { id: 9, name: 'superunhappy', icon: superunhappyIcon }, 
      { id: 10, name: 'shocked', icon: shockedIcon }, 
      { id: 11, name: 'smile2', icon: smile2Icon }, 
      { id: 12, name: 'bad', icon: badIcon },
    ],
    'People': [
      { id: 13, name: 'people1', icon: people1Icon }, 
      { id: 14, name: 'people2', icon: people2Icon }, 
      { id: 15, name: 'people3', icon: people3Icon },
      { id: 16, name: 'people4', icon: people4Icon },
      { id: 17, name: 'people5', icon: people5Icon }, 
      { id: 18, name: 'people6', icon: people6Icon }, 
      { id: 19, name: 'people7', icon: people7Icon },
      { id: 20, name: 'people8', icon: people8Icon },
      { id: 21, name: 'people9', icon: people9Icon }, 
      { id: 22, name: 'people10', icon: people10Icon }, 
      { id: 23, name: 'people11', icon: people11Icon }, 
      { id: 24, name: 'people12', icon: people12Icon }, 
      { id: 25, name: 'people13', icon: people13Icon },
      { id: 26, name: 'people14', icon: people14Icon },
      { id: 27, name: 'people15', icon: people15Icon }, 
      { id: 28, name: 'people16', icon: people16Icon }, 
      { id: 29, name: 'people17', icon: people17Icon },
      { id: 30, name: 'people18', icon: people18Icon },
      { id: 31, name: 'people19', icon: people19Icon }, 
      { id: 32, name: 'people20', icon: people20Icon },
      { id: 33, name: 'people21', icon: people21Icon }, 
      { id: 34, name: 'people22', icon: people22Icon }, 
      { id: 35, name: 'people23', icon: people23Icon },
      { id: 36, name: 'people24', icon: people24Icon },
      { id: 37, name: 'people25', icon: people25Icon }, 
      { id: 38, name: 'people26', icon: people26Icon }, 
      { id: 39, name: 'people27', icon: people27Icon },
      { id: 40, name: 'people28', icon: people28Icon },
      { id: 41, name: 'people29', icon: people29Icon }, 
      { id: 42, name: 'people30', icon: people30Icon },
      { id: 43, name: 'people31', icon: people31Icon },
      { id: 44, name: 'people32', icon: people32Icon },
      { id: 45, name: 'people33', icon: people33Icon },
      { id: 46, name: 'people34', icon: people34Icon },
      { id: 47, name: 'people35', icon: people35Icon },
      { id: 48, name: 'people36', icon: people36Icon },
      { id: 49, name: 'people37', icon: people37Icon },
      { id: 50, name: 'people38', icon: people38Icon },
      { id: 51, name: 'people39', icon: people39Icon },
      { id: 52, name: 'people40', icon: people40Icon },
      { id: 53, name: 'people41', icon: people41Icon },
      { id: 54, name: 'people42', icon: people42Icon },
      { id: 55, name: 'people43', icon: people43Icon },
      { id: 56, name: 'people44', icon: people44Icon },
      { id: 57, name: 'people45', icon: people45Icon },
      { id: 58, name: 'people46', icon: people46Icon },
      { id: 59, name: 'people47', icon: people47Icon },
      { id: 60, name: 'people48', icon: people48Icon },
      { id: 61, name: 'people49', icon: people49Icon },
      { id: 62, name: 'people50', icon: people50Icon },
      ],
    'Animals': [
      { id: 63, name: 'cat', icon: catIcon },
      { id: 64, name: 'dog', icon: dogIcon },
      { id: 65, name: 'fish', icon: fishIcon },
      { id: 66, name: 'lizard', icon: lizardIcon },
      { id: 67, name: 'pig', icon: pigIcon },
      { id: 68, name: 'rabbit', icon: rabbitIcon },
      { id: 69, name: 'rat1', icon: rat1Icon },
      { id: 70, name: 'rat2', icon: rat2Icon },
      { id: 71, name: 'rat3', icon: rat3Icon },
      { id: 72, name: 'snake', icon: snakeIcon },
      ],
    'Buildings': [
      { id: 73, name: 'cafe', icon: cafeIcon },
      { id: 74, name: 'castle', icon: castleIcon },
      { id: 75, name: 'court', icon: courtIcon },
      { id: 77, name: 'house1', icon: house1Icon },
      { id: 78, name: 'house2', icon: house2Icon },
      { id: 79, name: 'house3', icon: house3Icon },
      { id: 80, name: 'house4', icon: house4Icon },
      { id: 76, name: 'house5', icon: house5Icon },
      { id: 81, name: 'park', icon: parkIcon },
      { id: 82, name: 'pub', icon: pubIcon },
      { id: 83, name: 'school', icon: schoolIcon },
      { id: 84, name: 'sportcenter', icon: sportcenterIcon },
      ],
    };
        
export default tools;
export {pencilColors}