addLayer("c", {
    name: "coins", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(100),
    }},
    color: "#d4af37",
    resource: "coins", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    /*
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    */
    layerShown(){return true},
    buyables: {
        11: {
            title: "Worker",
            display() {
                return `You have ${format(getBuyableAmount("c", 11))} Workers.<br>They are creating ${format(buyableEffect("c", 11))} coins per second.<br>Cost: ${format(this.cost())}`
            },
            cost(x) {
                return new Decimal(1.26).pow(x).mul(100)
            },
            canAfford() {
                return player["c"].points.gte(this.cost())
            },
            buy() {
                player["c"].points = player["c"].points.sub(this.cost())
                addBuyables("c", 11, 1)
            },
            effect() {
                return new Decimal(10).mul(getBuyableAmount("c", 11).mul(pm))
            },
            style: {
                "height": "100px",
                "width": "100px"
            }
        },
        12: {
            title: "Investment",
            display() {
                return `You have ${format(getBuyableAmount("c", 12))} Investments.<br>They are creating ${format(buyableEffect("c", 12))} coins per second.<br>Cost: ${format(this.cost())}`
            },
            cost(x) {
                return new Decimal(1.5876).pow(x).mul(2000)
            },
            canAfford() {
                return player["c"].points.gte(this.cost())
            },
            buy() {
                player["c"].points = player["c"].points.sub(this.cost())
                addBuyables("c", 12, 1)
            },
            effect() {
                return new Decimal(100).mul(getBuyableAmount("c", 12).mul(pm))
            },
            style: {
                "height": "100px",
                "width": "100px"
            }
        },
        13: {
            title: "Printer",
            display() {
                return `You have ${format(getBuyableAmount("c", 13))} Printers.<br>They are creating ${format(buyableEffect("c", 13))} coins per second.<br>Cost: ${format(this.cost())}`
            },
            cost(x) {
                return new Decimal(2.0003).pow(x).mul(40000)
            },
            canAfford() {
                return player["c"].points.gte(this.cost())
            },
            buy() {
                player["c"].points = player["c"].points.sub(this.cost())
                addBuyables("c", 13, 1)
            },
            effect() {
                return new Decimal(1000).mul(getBuyableAmount("c", 13).mul(pm))
            },
            style: {
                "height": "100px",
                "width": "100px"
            }
        },
        14: {
            title: "Coin Mint",
            display() {
                return `You have ${format(getBuyableAmount("c", 14))} Coin Mints.<br>They are creating ${format(buyableEffect("c", 14))} coins per second.<br>Cost: ${format(this.cost())}`
            },
            cost(x) {
                return new Decimal(2.5205).pow(x).mul(800000)
            },
            canAfford() {
                return player["c"].points.gte(this.cost())
            },
            buy() {
                player["c"].points = player["c"].points.sub(this.cost())
                addBuyables("c", 14, 1)
            },
            effect() {
                return new Decimal(10000).mul(getBuyableAmount("c", 14).mul(pm))
            },
            style: {
                "height": "100px",
                "width": "100px"
            }
        },
        15: {
            title: "Alchemy",
            display() {
                return `You have ${format(getBuyableAmount("c", 15))} Alchemies.<br>They are creating ${format(buyableEffect("c", 15))} coins per second.<br>Cost: ${format(this.cost())}`
            },
            cost(x) {
                return new Decimal(3.1758).pow(x).mul(16000000)
            },
            canAfford() {
                return player["c"].points.gte(this.cost())
            },
            buy() {
                player["c"].points = player["c"].points.sub(this.cost())
                addBuyables("c", 15, 1)
            },
            effect() {
                return new Decimal(100000).mul(getBuyableAmount("c", 15).mul(pm))
            },
            style: {
                "height": "100px",
                "width": "100px"
            }
        },
        21: {
            title: "Accelerator",
            display() {
                return `You have ${format(getBuyableAmount("c", 21))} Accelerators.<br>They are increasing all production by ${format(buyableEffect("c", 21))}x.<br>Cost: ${format(this.cost())}`
            },
            cost(x) {
                return new Decimal(4).pow(x).mul(500)
            },
            canAfford() {
                return player["c"].points.gte(this.cost())
            },
            buy() {
                player["c"].points = player["c"].points.sub(this.cost())
                addBuyables("c", 21, 1)
            },
            effect() {
                return new Decimal(1.1).pow(getBuyableAmount("c", 21))
            }
        },
        22: {
            title: "Multiplier",
            display() {
                return `You have ${format(getBuyableAmount("c", 22))} Multipliers.<br>They are increasing all production by ${format(buyableEffect("c", 22))}x.<br>Cost: ${format(this.cost())}`
            },
            cost(x) {
                return new Decimal(10).pow(x).mul(10000)
            },
            canAfford() {
                return player["c"].points.gte(this.cost())
            },
            buy() {
                player["c"].points = player["c"].points.sub(this.cost())
                addBuyables("c", 22, 1)
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount("c", 22))
            }
        }
    },
    automate() {
        pm = getProdMultC()
        player.c.points = player.c.points.add(buyableEffect("c", 11).div(20).mul(pm))
        player.c.points = player.c.points.add(buyableEffect("c", 12).div(20).mul(pm))
        player.c.points = player.c.points.add(buyableEffect("c", 13).div(20).mul(pm))
        player.c.points = player.c.points.add(buyableEffect("c", 14).div(20).mul(pm))
        player.c.points = player.c.points.add(buyableEffect("c", 15).div(20).mul(pm))
    }
})