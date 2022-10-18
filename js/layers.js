addLayer("p", {
    name: "Prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0)
    }},
    color: "#F1A783",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "Prestige Points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        11: {
            title: "11",
            description: "Gain 1 point per second.",
            cost: new Decimal(1)
        },
        12: {
            title: "12",
            description: "Gain 2 more points per second.",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("p", 11)}
        },
        13: {
            title: "13",
            description: "Point gain softcap is slightly weaker.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade("p", 12)}
        },
        14: {
            title: "14",
            description: "Total Prestige Points multiply point gain.",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade("p", 13)},
            effect() {return decimalOne.plus(player.p.total.log(10))},
            effectDisplay() {
                return "x" + format(this.effect(), 2)
            }
        },
        15: {
            title: "15",
            description: "Triple point gain.",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade("p", 14)}
        }
    }
})
