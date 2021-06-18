/*----------------*
 *    OBJECTS     *
 *----------------*/
const HP = {
    high: "img/HPBar/HPBarHigh.png",
    med: "img/HPBar/HPBarMed.png",
    low: "img/HPBar/HPBarLow.png",
}

const buttonstatus = {
    enabled: "enabled",
    disabled: "disabled",
}

/*------PLAYER------*/
player = {

    bar: HP.high,
    name: "Bulbasaur",

    sprite: "",    
    sprites: {
        idle: "img/bulbasaur.png",
        dead: "img/pokeball.png",
    },

    combat: {
        numberOfAttacks: 0, // for å tracke hvor lenge det er til vi kan bruke special attack
        damMin: 5,
        damMax: 10,
        attacksNeededForSpecial: 3,
        crit: 10,
        critMultiplier: 100,
        miss: 0,
    },

    currentHealth: 100,
    maxHealth: 100,
}

/*------COMPUTER------*/
computer = {
    
    bar: HP.high,
    name: "Charmander",

    sprite: "",
    sprites: {
        idle: "img/charmander.png",
        dead: "img/pokeball.png",
    },

    combat: {
        numberOfAttacks: 0, // for å tracke hvor lenge det er til vi kan bruke special attack
        damMin: 6,
        damMax: 12,
        attacksNeededForSpecial: 3,
        crit: 10,
        critMultiplier: 100,
        miss: 10,
    },

    currentHealth: 150,   
    maxHealth: 150,
}