/*
layer template cuz laziness
addLayer("p", {
    name: "protons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		  points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "protons", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset quarks for protons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
*/

addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
      return {
        unlocked: true,
        points: new Decimal(0),
      };
    },
    resource: "Achievements",
    color: "#FFFF33",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
      return true;
    },
    tooltip: "Achievements",
    update(diff) {
      player.ach.points = new Decimal(player.ach.achievements.length).add(
        buyableEffect("a", 12)
      ); // effective achievements calculated here
    },
    achievements: {
      11: {
        name: "The Start",
        tooltip: "Get 1 Quark",
        done() {
          return player.points.gte(1);
        },
      },
      12: {
        name: "The Fundamentals",
        tooltip: "Get 1 of each Protons and Neutrons",
        done() {
          return player.p.points.min(player.n.points).gte(1);
        },
      },
      13: {
        name: "Atomic number 1.79e308",
        tooltip: "Get 1 Atom.<br>Reward: Multiply Quark gain by 2",
        done() {
          return player.a.points.gte(1);
        },
        effect() {
          return 2;
        },
      },
      14: {
        name: "Element I",
        tooltip: "Get 1 Element",
        done() {
          return getBuyableAmount("a", 11).gte(1);
        },
      },
      15: {
        name: "Lithium Ions",
        tooltip: "Purchase Lithium",
        done() {
          return getBuyableAmount("a", 13).gte(1);
        },
      },
      16: {
        name: "Power Surge!",
        tooltip: "Get 43 Atoms.<br>Reward: Unlock Electrons",
        done() {
          return player.a.points.gte(43);
        },
      },
      21: {
        name: "Carbonated",
        tooltip: "Buy 3 Carbon",
        done() {
          return getBuyableAmount('a', 23).gte(3)
        },
        unlocked() {
          return hasAchievement('ach', 16)
        },
      },
      22: {
        name: "Molecular Biology",
        tooltip: "Coming Soon...",
        done() {
          return hasUpgrade('e', 23) // player.m.points.gte(1)
        },
        unlocked() {
          return hasAchievement('ach', 16)
        },
      },
    },
  });
  
  addLayer("p", {
    name: "protons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
      return {
        unlocked: true,
        points: new Decimal(0),
      };
    },
    color: "#FF3333",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "protons", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {
      return player.points;
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    doReset(resettingLayer) {
      if (layers[resettingLayer].row <= this.row) return; // stops if the row of the resetting layer is smae or lower
  
      let keep = [];
      if (hasMilestone("a", 1)) keep.push("upgrades");
      layerDataReset(this.layer, keep);
  
      if (hasMilestone("a", 0)) player[this.layer].upgrades.push(22); // gives player this layer's upgrade with the id 22
    },
    gainMult() {
      // Calculate the multiplier for main currency from bonuses
      mult = new Decimal(1);
      if (hasUpgrade("n", 12)) mult = mult.mul(upgradeEffect("n", 12));
      if (hasUpgrade("a", 11)) mult = mult.mul(upgradeEffect("a", 11));
      if (hasUpgrade("a", 22)) mult = mult.mul(upgradeEffect("a", 22));
      if (hasUpgrade("e", 23)) mult = mult.mul(upgradeEffect("e", 23));
      if (hasMilestone("m", 11)) mult = mult.mul(2)
      mult = mult.mul(buyableEffect('a', 31));
      return mult;
    },
    gainExp() {
      // Calculate the exponent on main currency from bonuses
      return new Decimal(1);
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {
        key: "p",
        description: "P: Reset quarks for protons",
        onPress() {
          if (canReset(this.layer)) doReset(this.layer);
        },
      },
    ],
    passiveGeneration() {
      let gen = new Decimal(0);
      if (hasUpgrade("p", 22)) gen = gen.add(upgradeEffect("p", 22));
      return gen;
    },
    layerShown() {
      return true;
    },
    upgrades: {
      11: {
        description: "Double quark gain.",
        cost: new Decimal(1),
      },
      12: {
        description: "Boost neutron gain.",
        cost: new Decimal(4),
        effect() {
          return player.p.points.add(1).log10().add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: log10 (Protons)",
      },
      13: {
        description: "Quarks boost quarks.",
        cost: new Decimal(10),
        effect() {
          return player.points
            .add(1)
            .log(new Decimal(10).sub(buyableEffect("a", 11)))
            .add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: log10 (Quarks)", // TODO update this
      },
      21: {
        description: "Protons boost quarks.",
        cost: new Decimal(40),
        effect() {
          return player.p.points.add(2).div(2).root(3);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: cbrt (Protons ÷ 2)",
      },
      22: {
        description: "Gain 50% of proton gain every second",
        cost: new Decimal(2500),
        effect: 0.5,
      },
      23: {
        description: "Atoms boost quarks",
        cost: new Decimal("5e6"),
        effect() {
          return player.a.points.add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        unlocked() {
          return hasMilestone("a", 0);
        },
      },
    },
  });
  
  addLayer("n", {
    name: "neutrons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
      return {
        unlocked: true,
        points: new Decimal(0),
      };
    },
    color: "#3333FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "neutrons", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {
      return player.points;
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    doReset(resettingLayer) {
      if (layers[resettingLayer].row <= this.row) return; // stops if the row of the resetting layer is smae or lower
  
      let keep = [];
      if (hasMilestone("a", 1)) keep.push("upgrades");
      layerDataReset(this.layer, keep);
  
      if (hasMilestone("a", 0)) player[this.layer].upgrades.push(22); // gives player this layer's upgrade with the id 22
    },
    gainMult() {
      // Calculate the multiplier for main currency from bonuses
      mult = new Decimal(1);
      if (hasUpgrade("p", 12)) mult = mult.mul(upgradeEffect("p", 12));
      if (hasUpgrade("a", 12)) mult = mult.mul(upgradeEffect("a", 12));
      if (hasUpgrade("a", 21)) mult = mult.mul(upgradeEffect("a", 21));
      if (hasUpgrade("e", 23)) mult = mult.mul(upgradeEffect("e", 23));
      if (hasMilestone("m", 11)) mult = mult.mul(2)
      mult = mult.mul(buyableEffect('a', 31));
      return mult;
    },
    gainExp() {
      // Calculate the exponent on main currency from bonuses
      return new Decimal(1);
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {
        key: "n",
        description: "N: Reset quarks for neutrons",
        onPress() {
          if (canReset(this.layer)) doReset(this.layer);
        },
      },
    ],
    passiveGeneration() {
      let gen = new Decimal(0);
      if (hasUpgrade("n", 22)) gen = gen.add(upgradeEffect("n", 22));
      return gen;
    },
    layerShown() {
      return true;
    },
    upgrades: {
      11: {
        description: "Double quark gain.",
        cost: new Decimal(1),
      },
      12: {
        description: "Boost proton gain.",
        cost: new Decimal(4),
        effect() {
          return player.n.points.add(1).log10().add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: log10 (Neutrons)",
      },
      13: {
        description: "Quarks boost quarks.",
        cost: new Decimal(10),
        effect() {
          return player.points
            .add(1)
            .log(new Decimal(10).sub(buyableEffect("a", 11)))
            .add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: log10 (Quarks)", // TODO and this as well
      },
      21: {
        description: "Neutrons boost quarks.",
        cost: new Decimal(40),
        effect() {
          return player.n.points.add(2).div(2).root(3);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: cbrt (Neutrons ÷ 2)",
      },
      22: {
        description: "Gain 50% of neutron gain every second",
        cost: new Decimal(2500),
        effect: 0.5,
      },
      23: {
        description: "Achievements boost quarks",
        cost: new Decimal("2.5e7"),
        effect() {
          return player.ach.points.add(1).pow(2);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        unlocked() {
          return hasMilestone("a", 0);
        },
        tooltip: "Formula: Achievements ^ 2",
      },
    },
  });
  