const D = x => new Decimal(x)

addLayer("i", {
    name: "ideas", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "ideas", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("i", 14)) mult = mult.mul(2)
        if (hasUpgrade("i", 23)) mult = mult.mul(upgradeEffect("i", 23))
        if (hasUpgrade("i", 24)) mult = mult.mul(upgradeEffect("i", 24))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "i", description: "I: Reset for ideas points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Born again.",
            description: "[1]<br>Gain 1 point per second.",
            cost: D(1)
        },
        12: {
            title: "Boost.",
            description: "[2]<br>Gain another 1 point per second.",
            cost: D(1),
            unlocked() {return hasUpgrade("i", 11)}
        },
        13: {
            title: "Boost again.",
            description: "[3]<br>Double point gain.",
            cost: D(2),
            unlocked() {return hasUpgrade("i", 12)}
        },
        14: {
            title: "Is this just repetition?",
            description: "[4]<br>Double idea gain.",
            cost: D(5),
            unlocked() {return hasUpgrade("i", 13)}
        },
        21: {
            title: "Finally, something different!",
            description: "[5]<br>Point gain is boosted by points.",
            cost: D(15),
            unlocked() {return hasUpgrade("i", 14)},
            effect() {
                return player.points.add(1).log10().add(1)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            }
        },
        22: {
            title: "Back on Track.",
            description: "[6]<br>Point gain is boosted by ideas.",
            cost: D(30),
            unlocked() {return hasUpgrade("i", 21)},
            effect() {
                return player.i.points.add(1).sqrt()
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            }
        },
        23: {
            title: "...and we're right back.",
            description: "[7]<br>Idea gain is boosted by points.",
            cost: D(75),
            unlocked() {return hasUpgrade("i", 22)},
            effect() {
                return player.points.add(1).log10().cbrt().max(1)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            }
        },
        24: {
            title: "Self-synergy",
            description: "[8]<br>Idea gain is boosted by ideas.",
            cost: D(350),
            unlocked() {return hasUpgrade("i", 23)},
            effect() {
                return player.i.points.add(1).log(10).add(1)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            }
        }
    },
    branches: ["b"]
})

addLayer("b", {
    name: "boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#2468BB",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "boosters", // Name of prestige currency
    baseResource: "ideas", // Name of resource prestige is based on
    baseAmount() {return player.i.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    base: 2, // Prestige currency base
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "i", description: "I: Reset for ideas points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    effect() {
        return player.b.points.pow_base(2)
    },
    effectDescription() {
        return "boosting point gain by " + format(this.effect()) + "x"
    }
})