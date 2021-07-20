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
    "v0.1":"New Era"
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
    trueResource: "重置点(p点)", // Name of prestige currency
    trueBaseResource: "点数", // Name of resource prestige is based on
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
            display() {return `重置升级 不返回任何点数。`},
            onClick(){player.p.upgrades=[];player.points = new ExpantaNum(0)}
        }
    },
    layerShown(){return hasUpgrade("dev",14)},
    effect(){
        var eff = hasUpgrade("p",23) ? player.p.best.pow(0.5).add(1).pow(upgradeEffect("p",21)) : player.p.points.pow(0.5).add(1).pow(upgradeEffect("p",21))
        if(inChallenge("dev",21)) eff = eff.pow(1.2)
        return eff
    },
    effectDescription(){return `加成点数获取x${format(layers.p.effect(),1)}`},
    deactivated(){return !hasUpgrade("dev",14)},

    upgrades: {
        11: {
            description: "p11:p点获取量基于点数的数量级提升。",
            cost(){
                var base = new OmegaNum(9).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.points.max(1).log10().max(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",11),1)}`}
        },
        12: {
            description: "p12:点数加成自身。",
            cost(){
                var base = new OmegaNum(25).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.points.add(1).log10().add(1).pow(2).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",12),1)}`}
        },
        13: {
            description: "p13:重置点再次加成点数。",
            cost(){
                var base = new OmegaNum(128).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inpc11()) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.p.points.add(1).pow(2).log10().add(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",13),1)}`}
        },
        14: {
            description: "p14:重置点改善前三个升级。",
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
            description: "p15:点数改善p14。",
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
            description: "p21:点数加成重置点对点数的加成。",
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
            description: "p22:重置点加成重置点获取指数。",
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
            description: "p23:解锁两个个p挑战。注：进入它们重置p层级，但你目前的p点对点数的加成改为基于最大p点值。挑战中不能重置升级。挑战奖励不会因失去这个升级而消失。",
            cost(){return new OmegaNum(2e6).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))},
            unlocked(){return hasUpgrade("dev",22)||hasUpgrade("dev",23)},
        },
        24: {
            description: "p24:pc11的效果的平方影响点数。",
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
            description: "p25:获得一个随时间降低的点数产量加成。",
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
            challengeDescription: "重置p层级时，p层级升级被重置。同时，升级价格加上你的p点数的75%。",
            goalDescription(){return format(ExpantaNum(1e20))+"点数"},
            goal:ExpantaNum(1e20),
            rewardDisplay(){return `你在此挑战中的对数进度的立方(${format(player.p.cha["11log%"].pow(3).mul(100),2)}%)会给予你以下加成：<br /> x${format(challengeEffect("p", 11),2)}P点获取`},
            rewardEffect(){return OmegaNum(100).pow(player.p.cha["11log%"].pow(3))},
            unlocked(){return hasUpgrade("p",23)},
            onEnter(){player.p.upgrades=[23];player.p.points=new ExpantaNum(0)},
            onExit(){player.p.activeChallenge=11}
        },
        12: {
            name: "pc12:META P-POINT",
            challengeDescription: "超过你所拥有的p点的点数产量被软上限。(^0.5)p点数获取指数降低。(x0.8)",
            goalDescription(){return format(ExpantaNum(1e20))+"点数"},
            goal:ExpantaNum(1e20),
            rewardDisplay(){return `你在此挑战中的对数进度的立方(${format(player.p.cha["12log%"].pow(3).mul(100),2)}%)会给予你以下加成：<br /> x${format(challengeEffect("p", 12),2)}点数`},
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
    trueResource: "开发点", // Name of prestige currency
    trueBaseResource: "点数", // Name of resource prestige is based on
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
            display() {return `重置升级 返回你使用的 ${format(player.dev.total.sub(player.dev.points))} ${tmp[layer].resource}`},
            onClick(){player.dev.upgrades=[];player.dev.points=player.dev.total;for (let x = 9; x >= 0; x--) rowReset(x, "dev");player.points = new ExpantaNum(0);player.dev.activeChallenge=null}
        }
    },
    upgrades: {
        11: {
            description: "dev11:点数显示有点问题。修复一下。注：此类升级可能需要重新进入对应节点才能生效。",
            cost(){return hasChallenge("dev", 11) ? new OmegaNum(0) : new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(1)},
        },
        12: {
            description: "dev12:点数名称有点问题。修复一下。并且添加重置按钮的文字。",
            cost(){return hasChallenge("dev", 12) ? new OmegaNum(0) : new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(2)}
        },
        13: {
            description: "dev13:gameloop好像有点问题。让它循环起来。",
            cost(){return new OmegaNum(2)},
            unlocked(){return player.dev.total.gte(3)},
        },
        14: {
            description: "dev14:制作节点“P”。",
            cost(){return new OmegaNum(2)},
            unlocked(){return player.dev.total.gte(4)},
        },
        15: {
            description: "dev15:制作节点“P”的前5个升级。同时，解锁开发挑战11。（要不是少了devU11要很迷才不会有这个",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(5)},
        },
        21: {
            description: "dev21:开启开发者加速以便调试游戏。注：升级价格同样增加。该升级不能中途购买。",
            cost(){return new OmegaNum(2).add(isable(player.p.total.eq(0)))},
            unlocked(){return player.dev.total.gte(6)},
            effect(){return ExpantaNum(10).pow(player.dev.total.sub(4).sqrt().sub(1)).toNumber()}
        },
        22: {
            description: "dev22:制作节点“P”的第6至8升级。",
            cost(){return new OmegaNum(5)},
            unlocked(){return player.dev.total.gte(7)},
            effect(){return ExpantaNum(10).pow(player.dev.total.sub(4).sqrt().sub(1)).toNumber()}
        },
        23: {
            description: "dev23:制作节点“P”的前8个升级，但你只能在所有p升级中选择5个，以加强趣味性。注：和devU15和U22冲突。",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(7)},
            effect(){return hasUpgrade("dev",23) ? 5-player.p.upgrades.length : true}
        },
        24: {
            description: "dev24:开启开发挑战12.",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(7)},
        },
        25: {
            description: "dev25:开启开发挑战21...?",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(8)},
        },
    },

    challenges: {
        11: {
            name: "devc11:AntiLooperrrr",
            challengeDescription: "因为挑战出了bug，dev13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留dev11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
        12: {
            name: "devc12:Looperrrr",
            challengeDescription: "因为刷新功能时出了bug，刷新不能产生任何效果。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `loop的速度x20。同时，dev12效果被保留。`},
            unlocked(){return hasUpgrade("dev",24)}
        },
        21: {
            name: "devc21:buggy",
            challengeDescription: "游戏全是bug。现在你将获得以下效果：<br />1.刷新效果乘以一个不稳定的小于等于1的数<br />2.所有p挑战效果起效,除了pc12的效果2.<br />3.点数越多loop效率越低<br />4.开局解锁p挑战(不会产生重复的debuff)，挑战目标降至1e12，但重置p升级后会失效.<br />5.p点指数x1.1<br />6.p点效果^1.2",
            onEnter(){player.p.upgrades=[23]},
            canComplete(){return player.points.gte(1e13)},
            goalDescription(){return format(ExpantaNum(1e13))+"点数"},
            rewardDisplay(){return `开启最后两个p升级。`},
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
            modInfo.pointsName="点数"
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
    trueResource: "版本更新点", // Name of prestige currency
    trueBaseResource: "点数", // Name of resource prestige is based on
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
            display() {return `重置升级 重置你的增益点和减益点`},
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
            description: "你永远处在p挑战1中.",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.v.total.gte(1)},
            pay(){player.v.nerfp=player.v.nerfp.add(1)},
            currencyDisplayName:"减益点"
        },
        12: {
            title: "debuff12",
            description: "游戏速度x0.1.",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.v.total.gte(1)},
            pay(){player.v.nerfp=player.v.nerfp.add(1)},
            currencyDisplayName:"减益点"
        },
    },
    buyables:{
        11: {
            cost(x) { return x.add(1) },
            display() {
                var str = "buff11:更新<br />"
                str += `<txt style="color:${getBuyableAmount(this.layer, this.id).gte(1) ? "black" : "grey"}">LV1:更新时间降低开发点需求.(/${HARDformat(this.effect1(),1)})同时增幅点数获取.(x${HARDformat(this.effect1().sqrt(),1)})</txt><br />价格:${this.cost(getBuyableAmount(this.layer, this.id))}增益点`
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
        更新内容: {
            buttonStyle() {return  {'color': 'lime'}},
            content:
                ["main-display",
                ["display-text", function() {
                    var basestr = "你的增益点为 "+HARDformat(player.v.buffp)+" / "+HARDformat(player.v.points)
                    if(player.v.buffp.gt(player.v.points)) basestr+=` <warning style="color:red";>(WARNING:增益点大于上限!)</warning>`
                    return basestr
                }],
                ["display-text", function() {
                    var basestr = "你的减益点为 "+HARDformat(player.v.nerfp)+" / "+HARDformat(player.v.points)
                    if(player.v.nerfp.lt(player.v.points)) basestr+=` <warning style="color:red">(WARNING:减益点未达到目标!你的游戏暂停!)</warning>`
                    return basestr
                }],
                "prestige-button", "resource-display",
                "clickables",
                ["blank", "5px"], // Height
                "h-line",
                ["display-text", function() {return "增益升级"}],
                ["blank", "5px"],
                "buyables",
                ["blank", "5px"], // Height
                "h-line",
                ["display-text", function() {return "减益升级"}],
                "upgrades",
                ],

        },
        更新内容规则: {
            buttonStyle() {return {'border-color': 'lime'}},
            content:
                ["main-display",
                ["display-text", function() {return "欢迎来到版本节点!(?"}],
                ["display-text", function() {return "版本点会同时提高增益点上限和减益点的要求"}],
                ["display-text", function() {return "增益点必须不超过上限"}],
                ["display-text", function() {return "减益点必须不小于要求"}],
                ["display-text", function() {return "如果不满足以上两点，游戏会静止"}],
                ["display-text", function() {return "购买增益升级会提高增益点，减益升级提高减益点"}],
                ["display-text", function() {return "重置v升级并不会进行一次v重置，而是重置dev升级。"}],
                ["display-text", function() {return "就这样吧("}],
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
    none:"无",
    upd:"更新游戏",
    stu:"学习技术",
    sim:"简化代码",
    pat:"锻炼耐心",
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
    trueResource: "小时更新时间", // Name of prestige currency
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
            display() {return `更新游戏<br />你已经更新了${Utimeformat(player.u.updtime)}的进度.<br /><br />你正在进行:${updtxt[player.u.doing]}`},
            onClick(){player.u.doing = "upd"}
        },
        12: {
            canClick(){return true},
            display() {return `学习技术<br />你已经学习了${Utimeformat(player.u.stutime)}的内容.<br />这意味着你的速度x${HARDformat(player.u.stubuff,2)}(减益前).<br />由于耐心,这个数值^${HARDformat(getpatbuff(),2)}变为x${HARDformat(player.u.stubuff.pow(getpatbuff()),2)}`},
            onClick(){player.u.doing = "stu"},
            effect(){}
        },
        13: {
            canClick(){return true},
            display() {return `简化代码<br />你已经简化了${Utimeformat(player.u.simtime)}的代码.<br />这意味着你的时间减速效果变成${HARDformat(player.u.simbuff,2)}次根.`},
            onClick(){player.u.doing = "sim"}
        },
        14: {
            canClick(){return true},
            display() {return `锻炼耐心<br />你已经进行了${Utimeformat(player.u.pattime)}的锻炼.<br />这意味着你的耐心增长速度x${HARDformat(player.u.patbuff,2)}(${HARDformat(calcpattime(),5)}耐心/秒).<br />当前耐心:${HARDformat(player.u.patpoint,3)}`},
            onClick(){player.u.doing = "pat"}
        },
        //part2: reset layer 1
        21: {
            canClick(){return player.u.updtime.gt(600)},
            display() {return `内部测试<br />你已经测试了${Utimeformat(player.u.mupdtime)}的更新内容.<br />这意味着你的行动速度变为${HARDformat(player.u.mupdbuff,2)}次方,在减益后.<br />重置并获得${Utimeformat(metatime(player.u.updtime))}.`},
            onClick(){
                player.u.mupdtime = metatime(player.u.updtime).add(player.u.mupdtime);
                resetU(1,"mupd")
            },
        },
        22: {
            canClick(){return player.u.updtime.gt(1800)},
            display() {return `刻苦钻研<br />你已经研究了${Utimeformat(player.u.mstutime)}的学习内容.<br />这意味着你在该数值前的学习使速度额外x${HARDformat(player.u.mstubuff,2)}.(耐心加成前!)<br />重置并获得${Utimeformat(metatime(player.u.stutime))}.`},
            onClick(){
                player.u.mstutime = metatime(player.u.stutime).add(player.u.mstutime);
                resetU(1,"mstu")
            },
        },
        23: {
            canClick(){return player.u.updtime.gt(3600)},
            display() {return `添加注释<br />你已经添加了${Utimeformat(player.u.msimtime)}的注释代码.<br />这意味着你的开发时间会加成简化效果(x${HARDformat(player.u.msimbuff,2)}).<br />重置并获得${Utimeformat(metatime(player.u.simtime))}.`},
            onClick(){
                player.u.msimtime = metatime(player.u.simtime).add(player.u.msimtime);
                resetU(1,"msim")
            },
        },
        24: {
            canClick(){return player.u.tpatpoint.gt(1)},
            display() {return `元化耐心<br />你已经元化了${HARDformat(player.u.mpatpoint,2)}的耐心.<br />这意味着你的耐心上限x${HARDformat(player.u.mpatbuff,2)}.<br />重置并获得${HARDformat(metatime(player.u.tpatpoint))}.(基于无上限状态下耐心数:${HARDformat(player.u.tpatpoint,2)})`},
            onClick(){
                player.u.mpatpoint = metatime(player.u.tpatpoint).add(player.u.mpatpoint);
                resetU(1,"mpat")
            },
        },

    },
    upgrades: {
        11: {
            description: "next update is in 5 hours。",
            cost(){return new OmegaNum("6.9e420")},
            unlocked(){return true},
            currencyDisplayName:"小时更新时间"
        },
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
