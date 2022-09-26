let modInfo = {
	name: "The Elementree",
	id: "element-tree",
	author: "The ѱ",
	pointsName: "energy",
	modFiles: ["layers.js", "tree.js", "ach.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "v0.0.3",
	name: "The Birthplace",
}

let changelog = `
	<h1>Changelog:</h1><br>
	<h4>v0.0.4</h4><br>
	- Made achievements.
	- Added more upgrade stuff.
	<h4>v0.0.3</h4><br>
	- Added 2 more upgrades.
	- Added a buyable.
	- Changes colors of the layer.
	<h4>v0.0.2</h4><br>
	- Made some effect display text.
	- Added 3 more Hydrogen Upgrades.
	<h4>v0.0.1</h4><br>
	- Added 5 Hydrogen Upgrades.
	<h4>v0.0.0</h4><br>
	- Game is officially created! Woohoo!
`

const V_GAME = {
	MAX_BE_INT: new Decimal("(e^1.7976931348623156e308)1"),
	MAX_SAFE_INT: new Decimal("9007199254740991"),
	INFINITY: new Decimal(2).pow(1024),
	LOG2: new Decimal(2).log10(),
	LN2: new Decimal(2).ln(),
}

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
	if (hasUpgrade("h", 11)) gain = gain.plus(1)
	if (hasUpgrade("h", 12)) gain = gain.mul(upgradeEffect("h", 12))
	if (hasUpgrade("h", 13)) gain = gain.mul(upgradeEffect("h", 13))
	if (hasUpgrade("h", 15)) gain = gain.mul(2)
	if (hasUpgrade("h", 24)) gain = gain.mul(upgradeEffect("h", 24))
	gain = gain.mul(buyableEffect("h", 11))
	return Decimal.min(V_GAME.MAX_BE_INT, gain)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
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