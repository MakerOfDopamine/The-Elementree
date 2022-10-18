let modInfo = {
	name: "The Timewall",
	id: "walloftime",
	author: "",
	pointsName: "Points",
	modFiles: ["layers.js", "tree.js", "ach.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "v0.0.0",
	name: "Timewall",
}

let changelog = `
	<h1>Changelog:</h1><br>
	<h4>v0.0.0</h4><br>
	- Started Game.
`

const V_GAME = {
	MAX_BE_INT: new Decimal("(e^1.7976931348623156e308)1"),
	MAX_SAFE_INT: new Decimal("9007199254740991"),
	INFINITY: new Decimal(2).pow(1024),
	LOG2: new Decimal(2).log10(),
	LN2: new Decimal(2).ln(),
	psc: {
		first: new Decimal(10).sub(new Decimal(10).pow(0.8))
	}
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
	if (hasUpgrade("p", 11)) gain = new Decimal(1)
	if (hasUpgrade("p", 12)) gain = gain.add(3)
	if (hasUpgrade("p", 14)) gain = gain.mul(upgradeEffect("p", 14))
	if (hasUpgrade("p", 15)) gain = gain.mul(3)
	gain = gain.div(Decimal.max(getPointSoftcap(), 1))
	return Decimal.min(V_GAME.MAX_BE_INT, gain)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	softcapStart: {
		first: new Decimal(10)
	}
}}

function getPointSoftcap() {
	softcapExpo = 1
	if (hasUpgrade("p", 13)) softcapExpo = 0.95
	if (player.points.gte(10)) return Decimal.max(player.points.sub(V_GAME.psc.first).pow(softcapExpo+0.25), 1)
	return Decimal.max(player.points.pow(softcapExpo), 1)
}

function getSecondPointSoftcap() {
	return Decimal.min(player.points.div(100))
}

// Display extra things at the top of the page
var displayThings = [
	()=>{
		return (player.p.total.lt(1) || player.points.lte(1)) ? `` : `Your point gain is divided by ${format(getPointSoftcap(), 2) + (player.points.gte(10) ? " (scaled)" : "")}`
	},
	()=>{
		return (player.points.gte(100)) ? `Your point gain is raised to ^${format(getSecondPointSoftcap(), 4)}.` : ``
	}
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