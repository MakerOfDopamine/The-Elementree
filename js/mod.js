let modInfo = {
	name: "The Existance Tree",
	id: "lmaotreegobrrr_harry",
	author: "Harry (psi)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.1_f3",
	name: "Humble Beginnings",
}

let changelog = `
<h1>Changelog:</h1><br>
<b>v0.0.1f3</b><br>
- Rebalanced the booster cost.
- Upgrade 8 cost reduced (350 => 250)
<b>v0.0.1f2</b><br>
- Wow even more formatting issues<br>
<b>v0.0.1f1</b><br>
- Forgot to change the mod id and name :P<br>
<h3>v0.0.1</h3><br>
- Added ideas.<br>
- Added a small prototype of boosters.<br>
<h3>v0.0</h3><br>
- An idea.
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

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

	let gain = new Decimal(0)
	if (hasUpgrade("i", 11)) gain = gain.add(1)
	if (hasUpgrade("i", 12)) gain = gain.add(1)
	if (hasUpgrade("i", 13)) gain = gain.mul(2)
	if (hasUpgrade("i", 21)) gain = gain.mul(upgradeEffect("i", 21))
	if (hasUpgrade("i", 22)) gain = gain.mul(upgradeEffect("i", 22))

	gain = gain.mul(tmp.b.effect)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current Endgame: 1 booster (nothing after that lol)"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
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
}