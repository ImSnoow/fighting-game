/*----------------*
 *   REFERENCES   *
 *----------------*/
viewDiv = document.getElementById("view");

/*----------------*
 *    OBJECTS     *
 *----------------*/

player = {

    name: "Player",
    sprites: {
        idle: "img/playerIdle.png",
        attack: "img/playerAttack.png",
    },

    currentHealth: 100,
    health: 100,

    damMin: 5,
    damMax: 10,

    crit: 10,
    critMultiplier: 100,
    miss: 10,
}
computer = {
    
    name: "Computer",
    sprites: {
        idle: "img/npcIdle.png",
        attack: "img/npcAttack.png",
    },

    currentHealth: 150,   
    health: 150,

    damMin: 6,
    damMax: 12,

    crit: 10,
    critMultiplier: 100,
    miss: 10,
}

const HP = {
    high: "img/HPBar/HPBarHigh.png",
    med: "img/HPBar/HPBarMed.png",
    low: "img/HPBar/HPBarLow.png",
}


/*----------------*
 *     MODEL      *
 *----------------*/
const healthBarWidth = 300; // value in pixels

var playerBar;
var NPCBar;
/*----------------*
 *     START      *
 *----------------*/
updateView();

/*----------------*
 *   CONTROLLER   *
 *----------------*/
function getBarWidth(player, health, maxhealth)
{
    let percent = health/maxhealth;
    
    if (player == 0)
        UpdatePlayerBarColor(percent);
    else
        UpdateEnemyBarColor(percent);

    return Math.min((health/maxhealth) * healthBarWidth.toString(), healthBarWidth) + "px";
}

function UpdatePlayerBarColor(percent)
{
    if (percent > 0.66)
        playerBar = HP.high;
    else if (percent <= 0.66 && percent >= 0.33)
        playerBar = HP.med;
    else
        playerBar = HP.low;
}

function UpdateEnemyBarColor(percent)
{
    if (percent > 0.66)
        NPCBar = HP.high;
    else if (percent <= 0.66 && percent >= 0.33)
        NPCBar = HP.med;
    else
        NPCBar = HP.low;
}

function basicAttack()
{
    if (computer.currentHealth <= 0 || player.currentHealth <= 0)
        return;
        
    computer.currentHealth -= combatRoll(player);
    player.currentHealth -= combatRoll(computer);

    updateView();
}

function combatRoll(obj)
{
    // Først sjekk om vi bommer:
    let missRoll = Math.random() * 100;
    if (missRoll < obj.miss)
    {
        return 0;
    }

    // Om vi ikke bommer:
    let damMin = obj.damMin;
    let damMax = obj.damMax;
    let rolledDam = Math.round(Math.random() * (damMax - damMin) + damMin);
    
    // Sjekk om vi får et crit
    let critRoll = Math.random() * 100;   
    if (critRoll < obj.crit)
        rolledDam *= 1 + (obj.critMultiplier / 100);

    // Returner endelig skade
    console.log(obj.name + " gjorde " + rolledDam + " skade");
    return rolledDam;
}

/*----------------*
 *      VIEW      *
 *----------------*/
function updateView()
{
    viewDiv.innerHTML = `
        <div class="grid-container">
             <img id=playerHP width="${getBarWidth(0, player.currentHealth, player.health)}" height="64" src="${playerBar}" alt="playerHP" >  
             <div id="Top2VS">VS</div>
             <img id=npcHP width="${getBarWidth(1, computer.currentHealth, computer.health)}" height="64"src="${NPCBar}" alt="npcHP" >  
                                
            <img id=playerImg src="img/bulbasaur.png" alt="playerImg" width="256" height="256">  
            <div id="empty">tom</div>  
            <img id=playerImg src="img/charmander.png" alt="playerImg" width="256" height="256">  
             
            <div id="attacks">
                <button id="BottomATK1" onclick="basicAttack()">basic attack</button>  
                <button id="BottomATK2Crit">special attack</button> 
            </div> 
            <div id="Bottom empty">tom</div> 
            <div id="Bottom empty">tom</div>      
        </div>
    `;
}

