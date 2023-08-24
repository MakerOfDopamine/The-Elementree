let modInfo = {
	name: "The Fan Tree",
	id: "communitytree-butThisMightNotBeUniqueSo->9356109651926510569346011334876260698",
	author: "Thenonymous, with assistance from Harry for the Fans",
	pointsName: "quarks",
	modFiles: ["layers/row1.js", "layers/row2.js", "layers/row3.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 69.420,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.1_β1",
	name: "The First Day",
}

let changelog = `
<h1>Changelog:</h1><br>

<h3>v1.0</h3><br>
- Added Quarks.<br>
- Added Protons.<br>
- Added Neutrons.<br>
- Added Atoms.<br>
- Added Elements.<br>
- Added Electricity Charge.<bt>
- Added Electrons.<br>
`

let winText = `Congratulations! You have beat the <i>current</i> version of the game, but for now you can decide what to add next update >:] (in the server for The Modding Tree, look for "The Fan Tree")`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
  if (hasUpgrade("p", 11)) gain = gain.mul(new Decimal(2).pow(buyableEffect('a', 21)))
  if (hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13))
  if (hasUpgrade("p", 21)) gain = gain.mul(upgradeEffect("p", 21))
  if (hasUpgrade("p", 23)) gain = gain.mul(upgradeEffect("p", 23))
  
  if (hasUpgrade("n", 11)) gain = gain.mul(new Decimal(2).pow(buyableEffect('a', 21)))
  if (hasUpgrade("n", 13)) gain = gain.mul(upgradeEffect("n", 13))
  if (hasUpgrade("n", 21)) gain = gain.mul(upgradeEffect("n", 21))
  if (hasUpgrade("n", 23)) gain = gain.mul(upgradeEffect("n", 23))
  
  if (hasUpgrade('a', 13)) gain = gain.mul(upgradeEffect('a', 13))
  if (hasUpgrade('a', 23)) gain = gain.mul(upgradeEffect('a', 23))

  if (hasMilestone('m', 11)) gain = gain.mul(2)
  gain = gain.mul(buyableEffect('a', 31))
  
  if (hasUpgrade('e', 11)) gain = gain.mul(20)
  
  if (hasAchievement("ach", 13)) gain = gain.mul(2)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade('e', 23)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
  if(oldVersion == 0.0) player.e.time = toNumber(player.e.time)
}