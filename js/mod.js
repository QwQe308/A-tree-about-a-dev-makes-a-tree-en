let modInfo = {
	name: "A tree about a dev makes a tree",
	id: "the-DEV-tree",
	author: "QwQe308(qq3174905334,QwQ)",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	offlineLimit: 0.001,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "",
}

let changelog = `<h1>Changelog(real version):</h1><br>
	<h2>v0.23</h2><br>
		- Balanced v0.1.<br><br>
	<h2>v0.22</h2><br>
		- Fixed some bugs,made u node's layer 1 reset.<br><br>
	<h2>v0.21</h2><br>
		- Fixed some bugs and improved the tips.<br><br>
	<h2>v0.2</h2><br>
		- Made the base things in v and u node.Improved the tips.<br><br>
	<h2>v0.11</h2><br>
		- Made dev upg 21~25.<br><br>
	<h2>v0.1</h2><br>
		- Made dev upg 11~15.
	`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new ExpantaNum(0)
	let gain = new ExpantaNum(1)
	if(getBuyableAmount("v",11).gte(1)) gain = gain.mul(layers.v.buyables[11].effect1().sqrt())

	gain=gain.mul(layers.p.effect())
	if(hasUpgrade("p",12)) gain=gain.mul(upgradeEffect("p",12))
	if(hasUpgrade("p",13)) gain=gain.mul(upgradeEffect("p",13))
	gain = gain.mul(challengeEffect("p",12))
	if(hasUpgrade("p",24)) gain=gain.mul(upgradeEffect("p",24))
	if(hasUpgrade("p",25)) gain=gain.mul(upgradeEffect("p",25))
	if(inChallenge("p",12)||inChallenge("dev",21)){
		if(gain.gte(player.p.points)){
			gain=gain.div(player.p.points.add(1))
			gain=gain.sqrt()
			gain=gain.mul(player.p.points.add(1))
		}
	}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return "Try to refresh the game!All of the undefineds and the game freezed are not bugs."},
	function(){return "Tip:Autosave's delay is 0.5s,please refresh after the game saved."},
	function(){return "Current endgame:12 dev points and e56 points in v0.1."},
	function(){return `Next dev point: ${HARDformat(getdevreq())} points`},
	function(){return `0.1 second/refresh!${player.v.nerfp.lt(player.v.points) ? "<warning style='color:red'>(WARNING:Nerf points didn't reached the req!Your game is stopped!)</warning>" : ""}`},
	function(){return "Author：QwQ（QwQe308，qq3174905334）"},
]

// Determines when the game "ends"
function isEndgame() {
	return player.dev.total.gte(12)&&player.points.gte(1e56)&&player.v.points.eq(1)
}


// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1.79e308) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}