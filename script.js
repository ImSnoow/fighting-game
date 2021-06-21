/*----------------*
 *   REFERENCES   *
 *----------------*/
viewDiv = document.getElementById("view");
combatLog = document.getElementById("combatLog");

/****************************************************
 *                     MODEL                        *
 ****************************************************/
const healthBarWidth = 300; // value in pixels
var specialButtonEnabled = buttonstatus.disabled;
var basicButtonEnabled = buttonstatus.enabled;
var combatLog = [];
var basicButtonText = "Basic Attack";

/*----------------*
 *     START      *
 *----------------*/
player.sprite = player.sprites.idle;
computer.sprite = computer.sprites.idle;

updateView();




/****************************************************
 *                  CONTROLLER                      *
 ****************************************************/

function getBarWidth(obj)
{
    let percent = obj.currentHealth/obj.maxHealth;
    
    UpdateHealthBar(obj, percent);

    return Math.min((obj.currentHealth/obj.maxHealth) * healthBarWidth.toString(), healthBarWidth) + "px";
}

function UpdateHealthBar(obj, percent)
{
    if (percent > 0.66)
        obj.bar = HP.high;
    else if (percent <= 0.66 && percent >= 0.33)
        obj.bar = HP.med;
    else
        obj.bar = HP.low;
}


/*---------------------------------*
 *             COMBAT              *
 *---------------------------------*/

function GetComboPoints()
{
    let comboPoints = "(";

    for (i = 0; i < Math.min(3, player.combat.numberOfAttacks); i++)
    {
        comboPoints += "*";
    }

    comboPoints += ")";

    return comboPoints;
}

function capHealthAtZero()
{
    computer.currentHealth = Math.max(0, computer.currentHealth);
    player.currentHealth = Math.max(0, player.currentHealth);
}

function basicAttack()
{   
    computer.currentHealth -= combatRoll(player, false);
    if (IsDead()) return;

    player.currentHealth -= combatRoll(computer, false);
    if (IsDead()) return;

    buildComboPoints();

    basicButtonText = "Basic Button ComboPoints: " + GetComboPoints();

    if (player.combat.numberOfAttacks >= player.combat.attacksNeededForSpecial)
        enableSpecialAttack(true);

    updateView();
}

function specialAttack()
{
    computer.currentHealth -= combatRoll(player, true);
    if (IsDead()) return;

    player.currentHealth -= combatRoll(computer, false);
    if (IsDead()) return;

    spendComboPoints();

    basicButtonText = "Basic Button";

    updateView();
}

function combatRoll(obj, isSpecial)
{
    let isCrit = "";
    let attackType = "(Basic)";
    let effectiveness = "";

    let damMin = obj.combat.damMin;
    let damMax = obj.combat.damMax;
    let miss = obj.combat.miss;
    let crit = obj.combat.crit;
    let multiplier = obj.combat.critMultiplier;

    if (isSpecial)
    {
        attackType = "(Special)";
        damMin *= 2;
        damMax *= 2;
        miss = 0;
        crit = 100;
    }

    // Først sjekk om vi bommer:
    let missRoll = Math.random() * 100;
    if (missRoll < miss)
    {
        let newLogEntry = obj.name.toString() + " bommet";
        combatLog.push(newLogEntry);
        return 0;
    }
    
    // Om vi ikke bommer:
    let rolledDam = Math.round(Math.random() * (damMax - damMin) + damMin);
    effectiveness = checkIfMinMax(rolledDam, damMin, damMax);

    // Sjekk om vi får et crit
    let critRoll = Math.random() * 100;   
    if (critRoll < crit)
    {
        rolledDam *= 1 + (multiplier / 100);
        isCrit = "(Crit)";
    }

    // Returner endelig skade og oppdater log
    let newLogEntry = obj.name.toString() + " gjorde " + rolledDam.toString() + " skade " + attackType + isCrit + effectiveness;
    combatLog.push(newLogEntry);

    return rolledDam;
}

function checkIfMinMax(rolledDam, damMin, damMax)
{
    if (rolledDam == damMin)
        return " - It's not very effective";
    else if (rolledDam == damMax)
        return " - It's super effective!";
    else return "";
}

function buildComboPoints()
{
    player.combat.numberOfAttacks++;
    computer.combat.numberOfAttacks++;
}

function spendComboPoints()
{
    player.combat.numberOfAttacks = 0;
    enableSpecialAttack(false);
}

/*---------------------------------*
 *         User Interface          *
 *---------------------------------*/

function printCombatLog()
{
    let newLog = "";
    for (i = 0; i < combatLog.length; i++)
    {
        newLog += (i+1).toString() + ") " + combatLog[i] + "<br />";
    }

    return newLog;
}

function enableSpecialAttack(isEnabled)
{
    isEnabled == true ? specialButtonEnabled = buttonstatus.enabled : specialButtonEnabled = buttonstatus.disabled;
}


/*---------------------------------*
 *            GAME STATES          *
 *---------------------------------*/

function IsDead()
{
    if (computer.currentHealth <= 0 || player.currentHealth <= 0)
    {       
        capHealthAtZero();
        endGame();
        return true;
    }
    return false;
}

function endGame()
{
    basicButtonEnabled = buttonstatus.disabled;
    specialButtonEnabled = buttonstatus.disabled;

    if (player.currentHealth <= 0 && computer.currentHealth > 0)
    {
        player.sprite = player.sprites.dead;
        combatLog.push(computer.name.toString() + " vant!");
        alert("Du tapte!");
        //alert("Computer Vinner!");
    }
        
    else
    {
        computer.sprite = computer.sprites.dead;
        combatLog.push(player.name.toString() + " vant!");
        alert("Du vant!");
        //alert("Spiller Vinner!");
    }
        

    updateView();
}

/****************************************************
 *                      VIEW                        *
 ****************************************************/
function updateView()
{
    viewDiv.innerHTML = `
        <div class="grid-container">
             <div ><img id=playerHP width="${getBarWidth(player)}" height="64" src="${player.bar}" alt="playerHP" >${player.currentHealth}/${player.maxHealth}</div>
             <div id="TopVS">Bulbasaur VS Charmander</div>
             <div>${computer.currentHealth}/${computer.maxHealth}<img id=npcHP width="${getBarWidth(computer)}" height="64"src="${computer.bar}" alt="npcHP" ></div>  
                                
            <img id=playerImg src=${player.sprite} alt="playerImg" width="256" height="256">  
            <div id="combatLog">${printCombatLog()}</div>  
            <img id=playerImg src=${computer.sprite} alt="playerImg" width="256" height="256">  
             
            <div id="attacks">
                <button ${basicButtonEnabled} id="BottomATK1" onclick="basicAttack()">${basicButtonText}</button>  
                <button ${specialButtonEnabled} id="BottomATK2Crit" onclick="specialAttack()">Special Attack</button> 
            </div> 
            <div id="Bottom empty"></div> 
            <div id="Bottom empty"></div>      
        </div>
    `;
}

