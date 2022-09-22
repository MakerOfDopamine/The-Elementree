addLayer("h", {
    name: "hydrogen", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("h", 14)) mult = mult.mul(upgradeEffect("h", 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: Condense your energy into Hydrogen.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Hydrogen 1",
            description: "Gain 1 energy per second.",
            cost: new Decimal(1)
        },
        12: {
            title: "Hydrogen 2",
            description: "Hydrogen boosts Energy.",
            cost: new Decimal(1),
            effect() {
                return player.h.points.plus(2).sqrt()
            },
            unlocked() {
                return hasUpgrade("h", 11)
            }
        },
        13: {
            title: "Hydrogen 3",
            description: "Energy boosts Energy.",
            cost: new Decimal(3),
            effect() {
                return player.points.plus(10).log10()
            },
            unlocked() {
                return hasUpgrade("h", 12)
            }
        },
        14: {
            title: "Hydrogen 4",
            description: "Energy boosts Hydrogen.",
            cost: new Decimal(10),
            effect() {
                return player.points.plus(1).log10().pow(0.2).plus(1)
            },
            unlocked() {
                return hasUpgrade("h", 13)
            }
        },
        15: {
            title: "Hydrogen 5",
            description: "Double Energy gain.",
            cost: new Decimal(15),
            unlocked() {
                return hasUpgrade("h", 14)
            }
        }
    }
})
