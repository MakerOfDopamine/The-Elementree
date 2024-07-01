let modInfo = {
	name: "The RPG Tree",
	id: "therpgthatnobodyaskedfor",
	author: "Psi",
	pointsName: "seconds playing this game",
	modFiles: ["layers.js", "tree.js"],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `
<h1>Changelog:</h1><br>
<h3>v0.0</h3><br>
	- Added things.<br>
	- Added stuff.
`

let winText = `How did you see this??`

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
	return new Decimal(1)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	gameInitStage: 0
}}

// Display extra things at the top of the page
var displayThings = [
	() => {
		if (player.timePlayed < 60) return ""
		if (player.timePlayed < 3600) return `That's equivalent to ${format(player.timePlayed / 60, 2)} minutes!`
		if (player.timePlayed < 86400) return `That's equivalent to ${format(player.timePlayed / 3600, 2)} hours!`
		if (player.timePlayed < 31536000) return `That's equivalent to ${format(player.timePlayed / 86400, 2)} days!`
		if (player.timePlayed < 3153600000) return `That's equivalent to ${format(player.timePlayed / 31536000, 2)} years!`
		return "fuckign hacker"
	}
]

// Determines when the game "ends"
function isEndgame() {
	return false
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