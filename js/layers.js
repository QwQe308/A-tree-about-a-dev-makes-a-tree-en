var version = 54643642465
var DEVreq = {
    v0:[0.2,0.5,1,30,90,1e10,1e11,1e13,1e30,1e31,1e50,1e53],
    "v0.1":[0.4,1,2,60,120,2e10,4e11,5e13,8e30,1e32,1e51,2.5e54],
}
var VERSIONreq = {
    v0:1e56
}
var VERSIONchange = {
    0:0,
    1:0.1
}
var VERSIONname = {
    v0:"Bug Fix",
    "v0.1":"New Start"
}
//var VERSIONindex = {
//    v0:"<h1>v0.1</h1><br />Add the first layer and fixed lots of bugs.<br />",
//    "v0.1":"<h1>v0.1</h1><br />Made some things interesting like dimensions.<br />"
//}

var shownum = false
var showprestigetext = false
var layerslist=["p","dev","v","u"]

function isable(input){
    if(input) return 0;
    return "10{10}10"
}

function getdevreq(){
    var req = DEVreq["v"+version] ? (DEVreq["v"+version][player.dev.total.toNumber()] ? DEVreq["v"+version][player.dev.total.toNumber()]:"10{10}10") : "10{10}10"
    req = new ExpantaNum(req)
    if(getBuyableAmount("v",11).gte(1)) req = req.div(layers.v.buyables[11].effect1())
    return req
}

function inpc11(){
    return inChallenge("p",11)||inChallenge("dev",21)||hasUpgrade("v",11)
}

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        cha:{
            11:ExpantaNum(0),
            "11log%":ExpantaNum(0),
            12:ExpantaNum(0),
            "12log%":ExpantaNum(0),
        }
    }},
    color: "lightblue",
    canReset(){return hasUpgrade("dev",14)&&player.points.gte(layers.p.requires())},
    requires(){return new ExpantaNum(10)}, // Can be a function that takes requirement increases into account
    trueResource: "prestige point(pp)", // Name of prestige currency
    trueBaseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        mult = mult.mul(challengeEffect("p",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = new ExpantaNum(1)
        exp = exp.mul(upgradeEffect("p",22))
        if(inChallenge("p",12)) exp=exp.mul(0.8)
        if(inChallenge("dev",21)) exp=exp.mul(1.1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    clickables: {
        11: {
            canClick(){return player.dev.upgrades!=[]},
            display() {return `Reset the upgrades without returning any pp`},
            onClick(){player.p.upgrades=[];player.points = new ExpantaNum(0)}
        }
    },
    layerShown(){return hasUpgrade("dev",14)},
    effect(){
        var eff = hasUpgrade("p",23) ? player.p.best.pow(0.5).add(1).pow(upgradeEffect("p",21)) : player.p.points.pow(0.5).add(1).pow(upgradeEffect("p",21))
        if(inChallenge("dev",21)) eff = eff.pow(1.2)
        return eff
    },
    effectDescription(){return `Which makes points gain x${format(layers.p.effect(),1)} faster`},
    deactivated(){return !hasUpgrade("dev",14)},

    upgrades: {
        11: {
            description: "p11:pp gain is boosted based on your points' OoMs.",
            cost(){
                var base = new OmegaNum(9).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.points.max(1).log10().max(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}
        },
        12: {
            description: "p12:points boost points gain.",
            cost(){
                var base = new OmegaNum(25).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.points.add(1).log10().add(1).pow(2).pow(upgradeEffect("p",14))},
            effectDisplay(){return `x${format(upgradeEffect("p",12),1)}`}
        },
        13: {
            description: "p13:pp boost points gain again.",
            cost(){
                var base = new OmegaNum(128).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.p.points.add(1).pow(2).log10().add(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `x${format(upgradeEffect("p",13),1)}`}
        },
        14: {
            description: "p14:pp improve p11 p12 p13.",
            cost(){
                var base = new OmegaNum(8192).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",14) ? player.p.points.add(1).log10().add(1).pow(2).log10().div(5).add(1).pow(upgradeEffect("p",15)) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(player.p.points.add(1).log10().add(1).pow(2).log10().div(5).add(1).pow(upgradeEffect("p",15)),2)}`}
        },
        15: {
            description: "p15:points improve p14.",
            cost(){
                var base = new OmegaNum(131072).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",15) ? player.points.add(1).log10().add(1).pow(2).log10().div(10).add(1) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(player.points.add(1).log10().add(1).pow(2).log10().div(10).add(1),2)}`}
        },
        21: {
            description: "p21:points boost pp's boost to points gain.",
            cost(){
                var base = new OmegaNum(262144).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",22)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",21) ? ExpantaNum(1.75).sub(ExpantaNum(0.75).div(player.points.add(1).log10().pow(0.5).div(3).add(1))) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(ExpantaNum(1.75).sub(ExpantaNum(0.75).div(player.points.add(1).log10().pow(0.5).div(3).add(1))),2)}`}
        },
        22: {
            description: "p22:pp boost pp's gain exp.",
            cost(){
                var base = new OmegaNum(524288).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",22)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",22) ? ExpantaNum(1.5).sub(ExpantaNum(0.5).div(player.p.points.add(1).log10().pow(0.5).div(5).add(1))) : new ExpantaNum(1)},
            effectDisplay(){return `x${format(ExpantaNum(1.5).sub(ExpantaNum(0.5).div(player.p.points.add(1).log10().pow(0.5).div(5).add(1))),2)}`}
        },
        23: {
            description: "p23:unlock two p challenges.pp's base boost is based on highest pp this dev.Tip: pc will reset p layer,but this upg will be kept.You cannot reset p upg in pc.pc reward won't reset when you lost this upg.",
            cost(){return new OmegaNum(2e6).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))},
            unlocked(){return hasUpgrade("dev",22)||hasUpgrade("dev",23)},
        },
        24: {
            description: "p24:pc11's effect ^2 to points gain.",
            cost(){
                var base = new OmegaNum(1e27).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasChallenge("dev",21)},
            effect(){return challengeEffect("p",11).pow(2)},
            effectDisplay(){return `x${format(upgradeEffect("p",24),1)}`}
        },
        25: {
            description: "p25:get a boost to points gain that will decay over time.Effect reset on prestige.",
            cost(){
                var base = new OmegaNum(1e36).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasChallenge("dev",21)},
            effect(){return ExpantaNum(16384).div(player.p.resetTime+1000).pow(2).add(1)},
            effectDisplay(){return `x${format(upgradeEffect("p",25),1)}`}
        },
    },
    challenges: {
        11: {
            name: "pc11:SUPER PRESTIGE",
            challengeDescription: "When you perform a p reset,p upg is reseted too.Also,p upg's cost is added by your pp*75%。",
            goalDescription(){return format(ExpantaNum(layers.p.challenges[11].goal))+" points"},
            goal:ExpantaNum(1e20),
            rewardDisplay(){return `Your log10 progress ^3(${format(player.p.cha["11log%"].pow(3).mul(100),2)}%)will give you this boost:<br /> x${format(challengeEffect("p", 11),2)}pp gain`},
            rewardEffect(){return OmegaNum(100).pow(player.p.cha["11log%"].pow(3))},
            unlocked(){return hasUpgrade("p",23)},
            onEnter(){player.p.upgrades=[23];player.p.points=new ExpantaNum(0)},
            onExit(){player.p.activeChallenge=11}
        },
        12: {
            name: "pc12:META P-POINT",
            challengeDescription: "points gain greater than pp is softcapped.(^0.5)pp's gain exp is nerfed.(x0.8)",
            goalDescription(){return format(ExpantaNum(layers.p.challenges[12].goal))+" points"},
            goal:ExpantaNum(1e20),
            rewardDisplay(){return `Your log10 progress ^3(${format(player.p.cha["12log%"].pow(3).mul(100),2)}%)will give you this boost:<br /> x${format(challengeEffect("p", 12),2)}points`},
            rewardEffect(){return OmegaNum(1000).pow(player.p.cha["12log%"].pow(3))},
            unlocked(){return hasUpgrade("p",23)},
            onEnter(){player.p.upgrades=[23];player.p.points=new ExpantaNum(0)},
            onExit(){player.p.activeChallenge=12}
        },
    },
    onPrestige(gain){
        if(inpc11()){
            player.p.upgrades=[23]
            if(!inChallenge("p",11)&&!inChallenge("dev",21)) player.p.upgrades = []
        }
    },
    update(diff){
        if(!player.p.cha) player.p.cha={}
        for(i=11;i<=12;i++){
            if(inChallenge("p",i)){
                player.p.cha[i]=player.p.cha[i].max(player.points).min(layers.p.challenges[i].goal)
                player.p.cha[i+"log%"]=player.p.cha[i].add(1).log10().div(layers.p.challenges[i].goal.log10()).min(1)
                if(!hasUpgrade("p",23)) player.p.activeChallenge=null
        }}
    }
})

addLayer("dev", {
    name: "dev", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DEV", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires(){
        return getdevreq()
    }, // Can be a function that takes requirement increases into account
    trueResource: "dev points", // Name of prestige currency
    trueBaseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 10, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for dev points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    clickables: {
        11: {
            canClick(){return player.dev.upgrades!=[]},
            display() {return `reset dev upgs\nreturns ${format(player.dev.total.sub(player.dev.points))} ${tmp[layer].resource}`},
            onClick(){player.dev.upgrades=[];player.dev.points=player.dev.total;for (let x = 9; x >= 0; x--) rowReset(x, "dev");player.points = new ExpantaNum(0);player.dev.activeChallenge=null}
        }
    },
    upgrades: {
        11: {
            description: "dev11:The points is not shown.Fix it.\nTip:dev11 and dev12 sometimes need you reenter the node.",
            cost(){return hasChallenge("dev", 11) ? new OmegaNum(0) : new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(1)},
        },
        12: {
            description: "dev12:The points' name and the text on the prestige button is not shown.Fix these bugs.",
            cost(){return hasChallenge("dev", 12) ? new OmegaNum(0) : new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(2)}
        },
        13: {
            description: "dev13:Gameloop maybe broken.Let it loop.(makes your points gain automatly)",
            cost(){return new OmegaNum(2)},
            unlocked(){return player.dev.total.gte(3)},
        },
        14: {
            description: "dev14:Develop node 'P'.",
            cost(){return new OmegaNum(2)},
            unlocked(){return player.dev.total.gte(4)},
        },
        15: {
            description: "dev15:Develop the first 5 p upgs.Also,unlock dev challenge 11.",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(5)},
        },
        21: {
            description: "dev21:Use the devSpeed function to test the game.Tip：upg's cost is higher too.This upg cannot be bought after you start this dev.",
            cost(){return new OmegaNum(2).add(isable(player.p.total.eq(0)))},
            unlocked(){return player.dev.total.gte(6)},
            effect(){return ExpantaNum(10).pow(player.dev.total.sub(4).sqrt().sub(1)).toNumber()}
        },
        22: {
            description: "dev22:Develop p21 p22 p23.",
            cost(){return new OmegaNum(5)},
            unlocked(){return player.dev.total.gte(7)},
            effect(){return ExpantaNum(10).pow(player.dev.total.sub(4).sqrt().sub(1)).toNumber()}
        },
        23: {
            description: "dev23:Develop the first 8 p upgs,but you can only buy 5 p upgs,to make this game more interesting。Tip:dev15 and dev22 have no effect if you buy this upg.",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(7)},
            effect(){return hasUpgrade("dev",23) ? 5-player.p.upgrades.length : true}
        },
        24: {
            description: "dev24:unlock dev c12.(challenge 12)",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(7)},
        },
        25: {
            description: "dev25:unlock dev c13...?",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(8)},
        },
    },

    challenges: {
        11: {
            name: "devc11:AntiLooperrrr",
            challengeDescription: "Because you cannot fix the gameloop,dev13 has no effect.The refresh effect is x100 stronger.",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+" points"},
            rewardDisplay(){return `Dev11 always works,Also'The refresh effect is x100 stronger.'is kept.`},
            unlocked(){return hasUpgrade("dev",15)}
        },
        12: {
            name: "devc12:Looperrrr",
            challengeDescription: "because of some bugs,refresh does nothing.",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+" points"},
            rewardDisplay(){return `loop is faster(x20).Also,dev12 always works.`},
            unlocked(){return hasUpgrade("dev",24)}
        },
        21: {
            name: "devc21:FULL OF BUGS",
            challengeDescription: "There are so many bugs.Now you get these effects:<br />1.refresh's effect is unstable.(x0~x1)<br />2.All pc works,except pc12's second effect.<br />3.points slow down the loop.<br />4.Unlock pc when you start this dev(pc's debuff won't appear twice),pc's goal is 1e12,but you cannot reset p upgs.<br />5.pp's gain exp x1.1.<br />6.pp's effect^1.2.",
            onEnter(){player.p.upgrades=[23]},
            canComplete(){return player.points.gte(1e13)},
            goalDescription(){return format(ExpantaNum(1e13))+" points"},
            rewardDisplay(){return `unlocks the last two p upgs.`},
            unlocked(){return hasUpgrade("dev",25)}
        },
    },

    //inportant!!!
    update(diff){
        if(hasUpgrade("dev",11)||hasChallenge("dev",11)){
            shownum = true
        }else{
            shownum = false
        }
        if(hasUpgrade("dev",12)||hasChallenge("dev",12)){
            modInfo.pointsName="points"
            showprestigetext = true
            for(i in layerslist) {
            tmp[layerslist[i]].resource=tmp[layerslist[i]].trueResource
            tmp[layerslist[i]].baseResource=tmp[layerslist[i]].trueBaseResource
            }
        }
        else{
            modInfo.pointsName="undefined"
            showprestigetext = false
            for(i in layerslist){
            tmp[layerslist[i]].resource="undefined"
            tmp[layerslist[i]].baseResource="undefined"
            }
        }
        player.devSpeed=1
        if(hasUpgrade("dev",21)) player.devSpeed*=upgradeEffect("dev",21)
        if(inChallenge("dev",21)){
            layers.p.challenges[11].goal = ExpantaNum(1e12)
            layers.p.challenges[12].goal = ExpantaNum(1e12)
        }else{
            layers.p.challenges[11].goal = ExpantaNum(1e20)
            layers.p.challenges[12].goal = ExpantaNum(1e20)
        }
    }
})

function calcLoopTimeBoost(){
    var tb = 1
    if(hasChallenge("dev",12))  tb*=20
    if(inChallenge("dev",21)&&player.points.log10().toNumber()) tb/=player.points.add(10).log10().toNumber()
    if(player.v.nerfp.lt(player.v.points)) tb = 0
    if(hasUpgrade("v",12)) tb/=10
    return tb
}
function calcRefreshTimeBoost(){
    var tb = 1
    if((!hasChallenge("dev", 11)&&inChallenge("dev", 11))||hasChallenge("dev", 11)) tb*=100
    if(inChallenge("dev",12)) tb = 0
    if(inChallenge("dev",21)) tb*=Math.random()
    if(player.v.nerfp.lt(player.v.points)) tb = 0
    if(hasUpgrade("v",12)) tb/=10
    return tb
}

addLayer("v", {
    name: "version", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        buffp: new ExpantaNum(0),
        nerfp: new ExpantaNum(0),
        tp: new ExpantaNum(0)
    }},
    color: "#4BDC13",
    branches:["dev"],
    requires(){
        if(VERSIONreq["v"+version]){return ExpantaNum(VERSIONreq["v"+version])}
        else{return ExpantaNum("10{10}10")}
    }, // Can be a function that takes requirement increases into account
    trueResource: "version points", // Name of prestige currency
    trueBaseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 11, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for a new version", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.dev.total.gte(12)||player.v.total.gte(1)},
    clickables: {
        11: {
            canClick(){return true},
            display() {return `reset v upgs\nresets your buffp and nerfp`},
            onClick(){
                player.v.upgrades=[];player.v.points=player.v.total;for (let x = 9; x >= 0; x--) rowReset(x, "v");player.points = new ExpantaNum(0);player.v.activeChallenge=null
                player.dev.upgrades=[];player.dev.points=player.dev.total;player.dev.activeChallenge=null
                player.v.buffp = new ExpantaNum(0);player.v.nerfp = new ExpantaNum(0)
                for(i in player.v.buyables) player.v.buyables[i] = new ExpantaNum(0)
            }
        }
    },
    upgrades: {
        11: {
            title: "debuff11",
            description: "You're always in pc11.",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.v.total.gte(1)},
            pay(){player.v.nerfp=player.v.nerfp.add(1)},
            currencyDisplayName:"nerf points"
        },
        12: {
            title: "debuff12",
            description: "Game speed x0.1.",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.v.total.gte(1)},
            pay(){player.v.nerfp=player.v.nerfp.add(1)},
            currencyDisplayName:"nerf points"
        },
    },
    buyables:{
        11: {
            cost(x) { return x.add(1) },
            display() {
                var str = "buff11:Update<br />"
                str += `<txt style="color:${getBuyableAmount(this.layer, this.id).gte(1) ? "black" : "grey"}">LV1:Update time makes dev req lower.(/${HARDformat(this.effect1(),1)})Also,it boosts points gain.(x${HARDformat(this.effect1().sqrt(),1)})</txt><br />cost: ${this.cost(getBuyableAmount(this.layer, this.id))} buff points`
                 return str 
            },
            canAfford() { return player[this.layer].buffp.add(this.cost()).lte(player.v.points) },
            buy() {
                player[this.layer].buffp = player[this.layer].buffp.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect1(){
                return player.u.updtime.div(60).add(1)
            }
        }
    },
    /*
    challenges: {
        11: {
            name: "AntiLooperrrr",
            challengeDescription: "因为挑战出了bug，devU13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留dev11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
    },
    */
    tabFormat: {
        Version: {
            buttonStyle() {return  {'color': 'lime'}},
            content:
                ["main-display",
                ["display-text", function() {
                    var basestr = "Your buff points is "+HARDformat(player.v.buffp)+" / "+HARDformat(player.v.points)
                    if(player.v.buffp.gt(player.v.points)) basestr+=` <warning style="color:red";>(WARNING:增益点大于上限!)</warning>`
                    return basestr
                }],
                ["display-text", function() {
                    var basestr = "Your nerf points is "+HARDformat(player.v.nerfp)+" / "+HARDformat(player.v.points)
                    if(player.v.nerfp.lt(player.v.points)) basestr+=` <warning style="color:red">(WARNING:Nerf points didn't reached the req!Your game is stopped!)</warning>`
                    return basestr
                }],
                "prestige-button", "resource-display",
                "clickables",
                ["blank", "5px"], // Height
                "h-line",
                ["display-text", function() {return "buff upgs"}],
                ["blank", "5px"],
                "buyables",
                ["blank", "5px"], // Height
                "h-line",
                ["display-text", function() {return "nerf upgs"}],
                "upgrades",
                ],

        },
        Rules: {
            buttonStyle() {return {'border-color': 'lime'}},
            content:
                ["main-display",
                ["display-text", function() {return "Welcomes to the V node!"}],
                ["display-text", function() {return "vp(version points) will makes the buffp's limit and nerfp's req higher."}],
                ["display-text", function() {return "Buffp shouldn't be bigger than your buffp limit"}],
                ["display-text", function() {return "Nerfp shouldn't be smaller than your nerfp req"}],
                ["display-text", function() {return "If you cannot reach the nerfp req,the game will stop."}],
                ["display-text", function() {return "reset v upgs won't perform a v reset,but it will perform a dev reset and reset dev upgs."}],
                ["display-text", function() {return "That's all.:D"}],
                ["blank", "15px"],
                ],
        },

    },
    //inportant!!!
    update(diff){
        var vp = player.v.total.toNumber()
        version = VERSIONchange[vp]
        var strversion = "v"+version
        VERSION.num = version
        VERSION.name = VERSIONname[strversion]
        document.getElementById("version").innerHTML = strversion+"-"+VERSION.name
    }
})

var one = new ExpantaNum(1)
var two = new ExpantaNum(2)
var ten = new ExpantaNum(10)
function getscaling(time){
    scaling = time.div(60).add(1).pow(0.25)
    if(scaling.gt(2)) scaling = scaling.div(2).root(2).mul(2)
    scaling = scaling.mul(player.u.msimbuff)
    return scaling
}
var aday = new ExpantaNum(86400)
function calcpattime(){
    return player.u.patbuff.div(aday)
}
var updtxt = {
    none:"none",
    upd:"update",
    stu:"study",
    sim:"refactor",
    pat:"patience",
}
function progressU(rt){
    var speed = player.u.stubuff
    speed = speed.pow(getpatbuff())
    var scaling = player.u.simbuff
    var testvalue = rt
    var testvalue2 = rt
    for(i=1;i<=4;i++){
        testvalue = speed.add(1).root(testvalue.div(60).add(1).div(scaling).root(2)).sub(1).div(two.pow(testvalue.div(15).div(scaling).sqrt())).add(1).pow(player.u.mupdbuff).sub(1)
        testvalue = testvalue.mul(trueDiff).add(rt)
    }
    for(i=1;i<=5;i++){
        testvalue2 = speed.add(1).root(testvalue2.div(60).add(1).div(scaling).root(2)).sub(1).div(two.pow(testvalue2.div(15).div(scaling).sqrt())).add(1).pow(player.u.mupdbuff).sub(1)
        testvalue2 = testvalue2.mul(trueDiff).add(rt)
    }
    testvalue = testvalue.sub(rt)
    testvalue2 = testvalue2.sub(rt)
    if(testvalue.mul(10).lt(testvalue2)){
        testvalue = ExpantaNum(10).pow(testvalue.add(1).log10().add(testvalue2.add(1).log10().pow(0.5)).div(2))
    }
    return testvalue.add(rt).min(18000)
}
function getpatbuff(){
    var buff = player.u.patpoint.root(2).div(4).add(1)
    if(buff.gt(1.5)) buff = buff.div(1.5).root(2).mul(1.5)
    return buff
}
function resetU(rl,name = none){
    player.u.updtime= new ExpantaNum(0)
    player.u.stutime= new ExpantaNum(0)
    player.u.simtime= new ExpantaNum(0)
    player.u.pattime= new ExpantaNum(0)

    player.u.stubuff= new ExpantaNum(0)
    player.u.simbuff= new ExpantaNum(0)
    player.u.patbuff= new ExpantaNum(0)
    
    player.u.patpoint = new ExpantaNum(0)
    player.u.tpatpoint = new ExpantaNum(0)
}
function metatime(baseresnum){
    return baseresnum.pow(0.75)
}

addLayer("u", {
    name: "update", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        //part1
        unlocked: true,
		points: new ExpantaNum(0),

        updtime: new ExpantaNum(0),
        stutime: new ExpantaNum(0),
        simtime: new ExpantaNum(0),
        pattime: new ExpantaNum(0),

        stubuff: new ExpantaNum(0),
        simbuff: new ExpantaNum(0),
        patbuff: new ExpantaNum(1),

        patpoint: new ExpantaNum(0),

        doing:"none",

        //part2

        tpatpoint: new ExpantaNum(0),
        
        mupdtime: new ExpantaNum(0),
        mstutime: new ExpantaNum(0),
        msimtime: new ExpantaNum(0),
        mpatpoint: new ExpantaNum(0),

        mupdbuff: new ExpantaNum(1),
        mstubuff: new ExpantaNum(0),
        msimbuff: new ExpantaNum(0),
        mpatbuff: new ExpantaNum(1),
    }},
    color: "lime",
    trueResource: "hours of update time", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 11, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.v.total.gte(1)},
    clickables: {
        //part1
        11: {
            canClick(){return true},
            display() {return `Update the game<br />You've updated ${Utimeformat(player.u.updtime)}.<br /><br />Now you are doing:${updtxt[player.u.doing]}`},
            onClick(){player.u.doing = "upd"}
        },
        12: {
            canClick(){return true},
            display() {return `Study something useful<br />You've studied ${Utimeformat(player.u.stutime)}.<br />This means your U node speed x${HARDformat(player.u.stubuff,2)}(before nerf).<br />Because of your patience,this effect^${HARDformat(getpatbuff(),2)} = x${HARDformat(player.u.stubuff.pow(getpatbuff()),2)}`},
            onClick(){player.u.doing = "stu"},
            effect(){}
        },
        13: {
            canClick(){return true},
            display() {return `Refactor the code<br />You've refactored ${Utimeformat(player.u.simtime)}.<br />This means your U node nerf is to the ${HARDformat(player.u.simbuff,2)}th root.`},
            onClick(){player.u.doing = "sim"}
        },
        14: {
            canClick(){return true},
            display() {return `Learn the patience<br />You've learned ${Utimeformat(player.u.pattime)}.<br />This means your patience points' gain speed x${HARDformat(player.u.patbuff,2)}(${HARDformat(calcpattime(),5)}patp/s).<br />Current patience points(patp):${HARDformat(player.u.patpoint,3)}`},
            onClick(){player.u.doing = "pat"}
        },
        //part2: reset layer 1
        21: {
            canClick(){return player.u.updtime.gt(600)},
            display() {return `Test your game<br />You've tested ${Utimeformat(player.u.mupdtime)}.<br />This means your speed is powered by ${HARDformat(player.u.mupdbuff,2)},after the nerf.<br />Reset to get ${Utimeformat(metatime(player.u.updtime))}.`},
            onClick(){
                player.u.mupdtime = metatime(player.u.updtime).add(player.u.mupdtime);
                resetU(1,"mupd")
            },
        },
        22: {
            canClick(){return player.u.updtime.gt(1800)},
            display() {return `Do some research<br />You've researched ${Utimeformat(player.u.mstutime)}.<br />This means your study time before your research time boosts speed more. x${HARDformat(player.u.mstubuff,2)} .(before the patp boost!)<br />Reset to get ${Utimeformat(metatime(player.u.stutime))}.`},
            onClick(){
                player.u.mstutime = metatime(player.u.stutime).add(player.u.mstutime);
                resetU(1,"mstu")
            },
        },
        23: {
            canClick(){return player.u.updtime.gt(3600)},
            display() {return `Add some notes<br />You've added ${Utimeformat(player.u.msimtime)}.<br />This means your upd time boosts refactor effect(x${HARDformat(player.u.msimbuff,2)}).<br />Reset to get ${Utimeformat(metatime(player.u.simtime))}.`},
            onClick(){
                player.u.msimtime = metatime(player.u.simtime).add(player.u.msimtime);
                resetU(1,"msim")
            },
        },
        24: {
            canClick(){return player.u.tpatpoint.gt(1)},
            display() {return `Improve your patience<br />You have ${HARDformat(player.u.mpatpoint,2)} meta patp.<br />This means your patp cap x${HARDformat(player.u.mpatbuff,2)}.<br />Reset to get ${HARDformat(metatime(player.u.tpatpoint))}.(Based on your patp without cap:${HARDformat(player.u.tpatpoint,2)})`},
            onClick(){
                player.u.mpatpoint = metatime(player.u.tpatpoint).add(player.u.mpatpoint);
                resetU(1,"mpat")
            },
        },

    },
    /*
    upgrades: {
        11: {
            description: "next update is in 5 hours。",
            cost(){return new OmegaNum(5)},
            unlocked(){return true},
            currencyDisplayName:"hours of update time"
        },
    },
    */
    /*
    challenges: {
        11: {
            name: "AntiLooperrrr",
            challengeDescription: "因为挑战出了bug，devU13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留dev11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
    },
    */

    //inportant!!!
    update(diff){
        player.u.stubuff = ten.pow(player.u.stutime.div(10).add(1).root(3))
        if(player.u.stubuff.gt(1e5)) player.u.stubuff = player.u.stubuff.div(1e5).log10().add(1).pow(3).mul(1e5)
        player.u.stubuff = player.u.stubuff.mul(player.u.mstubuff)
        player.u.simbuff = getscaling(player.u.simtime)
        player.u.patbuff = ten.pow(player.u.pattime.div(60).add(1).log10().add(1).pow(1.5)).div(10)
        player.u.patpoint = player.u.patpoint.add(calcpattime().mul(trueDiff)).min(player.u.mpatbuff)

        player.u.tpatpoint = player.u.tpatpoint.add(calcpattime().mul(trueDiff))

        player.u.mupdbuff = player.u.mupdtime.div(60).add(1).log10().add(10).log10().pow(5)
        player.u.mstubuff = ten.pow(player.u.mstutime.min(player.u.stutime).div(180).add(1).root(2)).div(10)
        if(player.u.mstubuff.gt(100)) player.u.mstubuff = player.u.mstubuff.div(100).log10().add(1).pow(3).mul(100)
        player.u.msimbuff = player.u.updtime.div(60).add(10).log10().pow(player.u.msimtime.div(1800).add(1).root(2).sub(1))
        player.u.mpatbuff = player.u.mpatpoint.add(10).log10().pow(5)
        if(player.u.mpatbuff.gt(10)) player.u.mpatbuff = player.u.mpatbuff.div(10).root(2).mul(10)

        if(player.u.doing!="none") player.u[player.u.doing+"time"] = progressU(player.u[player.u.doing+"time"])
        player.u.points = player.u.updtime.div(3600)
    }
})
