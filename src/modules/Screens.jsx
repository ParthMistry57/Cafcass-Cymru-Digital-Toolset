import React from 'react'

// localStorage.removeItem("modules")

function setScreen(title, name, url, isEnabled=true, color="#ffffff", isImplemented=true) {
    /** Use to set default screen on the loadScreens function */
    return { title: title, name: name, url: url, isEnabled: isEnabled, color: color, isImplemented : isImplemented }
}
const defaultScreens = [
    //All default screens in the application, in the case there is none in memory
    /** @todo add colour lists */
    // setScreen("AvatarScreen", "Avatar", "/avatar", true, "#81AF5C"),
    setScreen("AboutMeScreen", "module_aboutMe", "/about-me", false, "#5262AD", false),
    setScreen("MyJourneyScreen", "module_MyJourney", "/myjourney", false, "#83B05C", false),
    setScreen("HowIFeelScreen", "module_How_I_Feel", "/howifeel", false, "#66C2C2", false),
    setScreen("FeelingSafeScreen", "module_Feeling_Safe", "/feelingsafe", false, "#D79F57", false),
    setScreen("ThreeWishesScreen", "module_Three_Wishes", "/3wishes", false, "#CB557B", false),
    setScreen("DirectWorkScreen", "module_Direct_Work", "/direct-work", true, "#66C3C3"),
    setScreen("LetterToJudgeScreen", "module_Letter_to_Judge", "/letter-to-judge", false, '#73B7D6'),
    setScreen("WriteALetterToJudge", "module_Write_Letter_to_Judge","/write-letter-to-judge", false, '#5262AD'),
    setScreen("FinalCommentsScreen", "module_Final_Comments","/final-comments", true, '#81AF5C')
];

function loadScreens() {
    /** Loads the selected modules from memory, otherwise create them */
    const moduleData = JSON.parse(localStorage.getItem('modules'));
    if (moduleData) return moduleData
    else return defaultScreens
}

class Screens {
    constructor() {
        this.all = loadScreens()
    }
    current() {
        return this.all.find(page => page.url === window.location.pathname)
    }
    next() {
        //Returns next screen, if this is the last enabled screen returns undefined
        let index = (this.all.findIndex(page => page.url === window.location.pathname)) + 1;
        for (index; index < this.all.length; index++) {
            //Finds first page that is enabled and returns it
            if (this.all[index].isEnabled) { return this.all[index] }
        }
        return undefined 
    }
    previous() {
        //Returns previous screen, if this is the first enabled screen returns undefined
        let index = (this.all.findIndex(page => page.url === window.location.pathname)) - 1;
        for (index; index >= 0; index--) {
            //Finds first page that is enabled and returns it
            if (this.all[index].isEnabled) { return this.all[index] }
        }
        return undefined 
    }
    save() {
        let toStore = JSON.stringify(this.all)
        localStorage.setItem('modules', toStore);
    }
    reload() {
        const moduleData = JSON.parse(localStorage.getItem('modules'));
        if (moduleData) {
            this.all = moduleData
        }
    }
    stringify() {
        return JSON.stringify(this.all)
    }
    add(screen, index=undefined) {
        if (index === undefined) {
            this.all.push(screen)
        }
        else {
            this.all = [
                ...this.all.slice(0, index),
                screen,
                ...this.all.slice(index)
        ]}
        this.save()
    }
    getEnabled() {
        return this.all.filter(page => page.isEnabled === true)
    }
}
const screens = new Screens()
export default screens