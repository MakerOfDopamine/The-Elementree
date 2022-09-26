addLayer("h", {
    name: "hydrogen", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#063971",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Hydrogen", // Name of prestige currency
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
                if (hasUpgrade("h", 22))
                    return player.h.points.plus(2).pow(0.65).pow(hasUpgrade("h", 21) ? upgradeEffect("h", 21) : 1)
                return player.h.points.plus(2).sqrt().pow(hasUpgrade("h", 21) ? upgradeEffect("h", 21) : 1)
            },
            unlocked() {
                return hasUpgrade("h", 11)
            },
            effectDisplay() {
                return "Currently: " + format(upgradeEffect("h", 12)) + "x"
            }
        },
        13: {
            title: "Hydrogen 3",
            description: "Energy boosts Energy.",
            cost: new Decimal(3),
            effect() {
                if (hasUpgrade("h", 23))
                    return player.points.plus(1).ln().plus(1).pow(1.25).pow(hasUpgrade("h", 21) ? upgradeEffect("h", 21) : 1)
                return player.points.plus(1).log10().plus(1).pow(1.25).pow(hasUpgrade("h", 21) ? upgradeEffect("h", 21) : 1)
            },
            unlocked() {
                return hasUpgrade("h", 12)
            },
            effectDisplay() {
                return "Currently: " + format(upgradeEffect("h", 13)) + "x"
            }
        },
        14: {
            title: "Hydrogen 4",
            description: "Energy boosts Hydrogen.",
            cost: new Decimal(10),
            effect() {
                return player.points.plus(1).log10().pow(0.2).plus(1).pow(hasUpgrade("h", 21) ? upgradeEffect("h", 21) : 1)
            },
            unlocked() {
                return hasUpgrade("h", 13)
            },
            effectDisplay() {
                return "Currently: " + format(upgradeEffect("h", 14)) + "x"
            }
        },
        15: {
            title: "Hydrogen 5",
            description: "Double Energy gain.",
            cost: new Decimal(15),
            unlocked() {
                return hasUpgrade("h", 14)
            }
        },
        21: {
            title: "Hydrogen 6",
            description: "Boost all above upgrades (Except Hydrogen 5) based on Energy.",
            cost: new Decimal(40),
            effect() {
                return player.points.plus(10).log10().plus(10).log10().sqrt()
            },
            unlocked() {
                return hasUpgrade("h", 15)
            },
            effectDisplay() {
                return "Currently: ^" + format(upgradeEffect("h", 21), 3)
            }
        },
        22: {
            title: "Hydrogen 7",
            description: "Hydrogen 2 Formula is improved. (^0.65)",
            cost: new Decimal(80),
            unlocked() {
                return hasUpgrade("h", 21)
            }
        },
        23: {
            title: "Hydrogen 8",
            description: "log10 in Hydrogen 3 is reduced to a ln.",
            cost: new Decimal(250),
            unlocked() {
                return hasUpgrade("h", 22)
            }
        },
        24: {
            title: "Hydrogen 9",
            description: "For every upgrade multiply Energy gain by 1.3 times.",
            cost: new Decimal(1000),
            unlocked() {
                return hasUpgrade("h", 23)
            },
            effect() {
                let count = 0
                for (let i = 1; i < 5; i++) {
                    for (let j = 1; j < 5; j++) {
                        count += (hasUpgrade("h", Number(String(i) + String(j))) ? 1 : 0)
                    }
                }
                return new Decimal(1.3).pow(count)
            },
            effectDisplay() {
                return "Currently: x" + format(upgradeEffect("h", 24), 2)
            }
        },
        25: {
            title: "Hydrogen 10",
            description: "Unlock a Buyable.",
            cost: new Decimal(10000),
            unlocked() {
                return hasUpgrade("h", 24)
            }
        },
        31: {
            title: "Deuterium 1",
        }
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(2.5).pow(x).mul(2000) },
            display() { return "Double energy gain.<br>Currently: " + format(this.effect(), 2) + "x<br>Cost: " + format(this.cost(), 2) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect() { return new Decimal(2).pow(getBuyableAmount("h", 11))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount("h", 11, getBuyableAmount("h", 11).add(1))
            },
            unlocked() {
                return hasUpgrade("h", 25)
            }
        }
    },
    milestones: {
        11: {
            requirementDescription: "100,000 Hydrogen",
            effectDescription: "Gain 10% of Hydrogen gain on reset every second.",
            done() { return player.h.points.gte(100000) }
        }
    },
    passiveGeneration() {
        if (hasMilestone("h", 11)) return 0.1
        return 0
    }
})
