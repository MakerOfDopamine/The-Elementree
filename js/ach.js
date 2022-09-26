addLayer("ach", {
    row: "side",
    tooltip: "",
    symbol: "A",
    color: "#aaaaaa",
    achievements: {
        11: {
            name: "Hydrogen Collection 1",
            done() {
                return player.h.points.gte(1)
            },
            tooltip: "Get 1 Hydrogen."
        },
        12: {
            name: "Hydrogen Collection 2",
            done() {
                return player.h.points.gte(100)
            },
            tooltip: "Get 100 Hydrogen."
        },
        13: {
            name: "Hydrogen Collection 3",
            done() {
                return player.h.points.gte(10000)
            },
            tooltip: "Get 10,000 Hydrogen."
        },
        14: {
            name: "Hydrogen Collection 4",
            done() {
                return player.h.points.gte(1e6)
            },
            tooltip: "Get 1,000,000 Hydrogen."
        },
        15: {
            name: "Hydrogen Collection 5",
            done() {
                return player.h.points.gte(1e9)
            },
            tooltip: "Get 1e9 Hydrogen."
        },
        21: {
            name: "Hydrogen Upgrade 1",
            done() {
                return hasUpgrade("h", 12)
            },
            tooltip: "Get 2 Hydrogen Upgrades."
        },
        22: {
            name: "Hydrogen Upgrade 2",
            done() {
                return hasUpgrade("h", 14)
            },
            tooltip: "Get 4 Hydrogen Upgrades."
        },
        23: {
            name: "Hydrogen Upgrade 3",
            done() {
                return hasUpgrade("h", 21)
            },
            tooltip: "Get 6 Hydrogen Upgrades."
        },
        24: {
            name: "Hydrogen Upgrade 4",
            done() {
                return hasUpgrade("h", 23)
            },
            tooltip: "Get 8 Hydrogen Upgrades."
        },
        25: {
            name: "Hydrogen Upgrade 5",
            done() {
                return hasUpgrade("h", 25)
            },
            tooltip: "Get 10 Hydrogen Upgrades."
        },
    }
})