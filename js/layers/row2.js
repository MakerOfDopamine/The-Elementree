addLayer("a", {
    name: "atoms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
      return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
      };
    },
    color: "#4DFF4D",
    requires: new Decimal(25000), // Can be a function that takes requirement increases into account
    resource: "atoms", // Name of prestige currency
    baseResource: "protons and neutrons", // Name of resource prestige is based on
    baseAmount() {
      return player.p.points.min(player.n.points);
    }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base() {
      let base = new Decimal(hasMilestone("a", 2) ? 1.75 : 2);
      base = base.sub(1).mul(buyableEffect("a", 23)).add(1);
      return base;
    },
    canBuyMax() {
      return hasMilestone("a", 1);
    },
    autoPrestige() {
      return hasUpgrade('e', 22);
    },
    resetsNothing() {
      return hasUpgrade('e', 22);
    },
    gainMult() {
      // Calculate the multiplier for main currency from bonuses
      mult = new Decimal(1);
      if(hasUpgrade('e', 12)) mult = mult.div(upgradeEffect('e', 12));
      mult = mult.div(buyableEffect('a', 32));
      return mult;
    },
    gainExp() {
      // Calculate the exponent on main currency from bonuses
      return new Decimal(1);
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {
        key: "a",
        description: "A: Reset p/n for atoms",
        onPress() {
          if (canReset(this.layer)) doReset(this.layer);
        },
      },
    ],
    tabFormat: {
      Main: {
        unlocked() {
          return hasMilestone("a", 1) || player.m.points.gte(1);
        },
        content: [
          "main-display", // start of necessary
          "prestige-button",
          "resource-display", // end of necessary
          "blank",
          "milestones",
          "blank",
          "upgrades",
          "blank",
        ],
      },
      Elements: {
        unlocked() {
          return hasMilestone("a", 1) || player.m.points.gte(1);
        },
        content: [
          "main-display", // start of necessary
          "prestige-button",
          "resource-display", // end of necessary
          "blank",
          "buyables",
          "blank",
        ], // buyables are complicated
      },
    },
    branches: ["p", "n"],
    layerShown() {
      return (hasUpgrade("p", 22) && hasUpgrade("n", 22)) || player.a.best.gte(1);
    },
    upgrades: {
      11: {
        description: "Protons are boosted by atoms (Atoms kept on purchase)",
        cost: new Decimal(1),
        effect() {
          return player.a.points.add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: atoms",
        pay() {}, // Doesn't subtract cost when you buy the upgrade
        canAfford() {return player.a.points.gte(this.cost)},
      },
      12: {
        description: "Neutrons are boosted by atoms (Atoms kept on purchase)",
        cost: new Decimal(2),
        effect() {
          return player.a.points.add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Formula: atoms",
        pay() {},
        canAfford() {return player.a.points.gte(this.cost)},
      },
      13: {
        description: "Quark gain is boosted by protons, neutrons and atoms",
        cost: new Decimal(3),
        effect() {
          return player.a.points
            .add(1)
            .times(player.p.points.add(player.n.points).add(1))
            .add(1)
            .log(10)
            .add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "log10 (atoms × (protons + neutrons))",
      },
      21: {
        description:
          "Unlock a new Element and boost neutron gain by achievements",
        cost: new Decimal(9),
        effect() {
          return player.ach.points.add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
      },
      22: {
        description: "Unlock a new Element and boost proton gain by achievements",
        cost: new Decimal(13),
        effect() {
          return player.ach.points.add(1);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
      },
      23: {
        description: "Unlock a new Element and boost quark gain",
        cost: new Decimal(23),
        effect() {
          return player.a.points.add(1).pow(2);
        },
        effectDisplay() {
          return format(this.effect()) + "×";
        },
        tooltip: "Atoms ^ 2",
      },
    },
    milestones: {
      0: {
        requirementDescription: "5 Atoms",
        effectDescription:
          "Keep proton and neutron upgrade 5 (id: 22) and unlock 1 upgrade each",
        done() {
          return player.a.points.gte(5);
        },
      },
      1: {
        requirementDescription: "7 Atoms",
        effectDescription:
          "Unlock Elements, Keep All Proton and Neutron Upgrades and you can buy max atoms",
        done() {
          return player.a.points.gte(7);
        },
      },
      2: {
        requirementDescription: "1 Lithium",
        effectDescription: "Decrease Atom Cost Scaling 2 -> 1.75",
        done() {
          return getBuyableAmount("a", 13).gte(1);
        },
        unlocked() {
          return hasMilestone("a", 1);
        },
      },
    },
    buyables: {
      11: {
        title: "Hydrogen",
        display() {
          return `Buy some hydrogen to reduce the log base of Upgrade 13 by 0.75 each, in both layers!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/10 are bought.
                            \nThe next Hydrogen costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: -${format(this.effect())}`;
        },
        cost() {
          return new Decimal(2)
            .pow(getBuyableAmount(this.layer, this.id))
            .floor();
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id).mul(0.75);
        },
        tooltip: "0.75 × amt",
        purchaseLimit: 10,
      },
      12: {
        title: "Helium",
        display() {
          return `Buy some helium to increase the effective achievement count for upgrades!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/10 are bought.
                            \nThe next Helium costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: +${format(this.effect())}`;
        },
        cost() {
          return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)).mul(6);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id)
            .mul(buyableEffect("a", 22) /*Boron effect*/)
            .mul(player.a.points.add(1).sqrt().log(2));
        },
        tooltip: "(log2 sqrt Atoms) × amt",
        purchaseLimit: 10,
      },
      13: {
        title: "Lithium", // the effect is changed yes
        display() {
          return `Buy some Lithium to boost quark gain by total elements!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/10 are bought.
                            \nThe next Lithium costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: ×${format(this.effect())}`;
        },
        cost() {
          return new Decimal(3).pow(getBuyableAmount(this.layer, this.id)).mul(8);
        },
        unlocked() {
          return getBuyableAmount("a", 11).gte(4);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          let totalElements = new Decimal(0);
          for (id in player.a.buyables) {
            totalElements = totalElements.add(player.a.buyables[id]);
          }
          return getBuyableAmount(this.layer, this.id)
            .mul(buyableEffect("a", 22) /*Boron effect*/)
            .pow_base(totalElements.add(1).log(2).pow(2));
        },
        tooltip: "log2 (total elements) ^ 2 ^ amt",
        purchaseLimit: 10,
      },
      21: {
        title: "Beryllium",
        display() {
          return `Buy some Beryllium to boost Upgrade 1 based on Hydrogen, in both layers!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/10 are bought.
                            \nThe next Beryllium costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: ^${format(this.effect())}`;
        },
        cost() {
          return new Decimal(1.1)
            .pow(getBuyableAmount(this.layer, this.id).pow(2))
            .mul(10)
            .ceil();
        },
        unlocked() {
          return hasUpgrade("a", 21);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id)
            .mul(buyableEffect("a", 22) /*Boron effect*/)
            .root(2)
            .pow_base(getBuyableAmount("a", 11));
        },
        tooltip() {
          return (
            "Hydrogen ^ sqrt amt<br>After effect: ×" +
            format(new Decimal(2).pow(buyableEffect("a", 21)))
          );
        },
        purchaseLimit: 10,
      },
      22: {
        title: "Boron",
        display() {
          return `Buy some Boron to boost previous element effects! (excluding hydrogen)
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/3 are bought.
                            \nThe next Boron costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: ×${format(this.effect())}`;
        },
        cost() {
          return new Decimal(1.05)
            .pow(getBuyableAmount(this.layer, this.id).pow(2))
            .mul(13)
            .add(getBuyableAmount(this.layer, this.id))
            .floor();
        },
        unlocked() {
          return hasUpgrade("a", 22);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id).mul(0.2).add(1);
        },
        tooltip: "amt / 5",
        purchaseLimit: 3,
      },
      23: {
        title: "Carbon",
        display() {
          return `Buy some Carbon to reduce atom cost scaling!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/3 are bought.
                            \nThe next Carbon costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: ×${format(this.effect())}`;
        },
        cost() {
          return getBuyableAmount(this.layer, this.id)
            .pow_base(1.3)
            .mul(31)
            .round();
        },
        unlocked() {
          return hasUpgrade("a", 23);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id).pow_base(0.9);
        },
        tooltip: "0.9 ^ amt",
        purchaseLimit: 3,
      },
      31: {
        title: "Nitrogen",
        display() {
          return `Buy some Nitrogen to boost quark, proton and neutron gain by electrons!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/10 are bought.
                            \nThe next Nitrogen costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: ×${format(this.effect())}`;
        },
        cost() {
          return getBuyableAmount(this.layer, this.id)
            .pow_base(1.05)
            .mul(81)
            .round();
        },
        unlocked() {
          return hasUpgrade("e", 13);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id).pow_base(player.e.electrons.add(1));
        },
        tooltip: "electrons ^ amt",
        purchaseLimit: 10,
      },
      32: {
        title: "Oxygen",
        display() {
          return `Buy some Oxygen to divide atom costs by quarks!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/10 are bought.
                            \nThe next Oxygen costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: ÷${format(this.effect())}`;
        },
        cost() {
          return getBuyableAmount(this.layer, this.id)
            .pow_base(1.1)
            .mul(82)
            .round();
        },
        unlocked() {
          return hasUpgrade("e", 13);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id).pow_base(player.points.add(1).log(10).add(1));
        },
        tooltip: "log10 quarks ^ amt",
        purchaseLimit: 10,
      },
      33: {
        title: "Flourine",
        display() {
          return `Buy some Flourine to multiply electrons by 2!
                            \nCurrently, ${format(
                              getBuyableAmount(this.layer, this.id), 0
                            )}/10 are bought.
                            \nThe next Flourine costs ${format(
                              this.cost(), 0
                            )} atoms.
                            \nCurrently: ÷${format(this.effect())}`;
        },
        cost() {
          return getBuyableAmount(this.layer, this.id)
            .pow_base(1.15)
            .mul(83)
            .round();
        },
        unlocked() {
          return hasUpgrade("e", 13);
        },
        canAfford() {
          return player.a.points.gte(this.cost());
        },
        buy() {
          player.a.points = player.a.points.sub(this.cost());
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return getBuyableAmount(this.layer, this.id).pow_base(2);
        },
        tooltip: "2 ^ amt",
        purchaseLimit: 10,
      },
    },
  });
  addLayer("e", {
    name: "electrons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
      return {
        unlocked: true,
        points: new Decimal(0),
        time: new Decimal(0),
        electrons: new Decimal(0),
      };
    },
    color: "#FFFF33",
    resource: "electricity charge", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {
        key: "e", description: "E: Gain Electrons", onPress(){clickClickable('e', 11)}
      },
    ],
    prestigeNotify() {
      return tmp.e.clickables[11].canClick && tmp.e.clickables[11].unlocked;
    },
    update(diff) {
      player.e.time += diff
      let extraMult = new Decimal(0);
      if(tmp.e.layerShown) player.e.time = toNumber(new Decimal(player.e.time).add(extraMult.mul(diff))); // !! this is the calculation of time -> ec (; is the end of calculation)
      player.e.points = new Decimal(player.e.time)
        .root(2)
        .add(buyableEffect('e', 11))
        .mul(buyableEffect('e', 12))
        .mul(buyableEffect('e', 13))
        .mul(hasUpgrade('e', 11) ? upgradeEffect('e', 11) : 1)
        .mul(hasUpgrade('e', 21) ? upgradeEffect('e', 21) : 1)
        .mul(player.e.electrons.add(1));
    },
    tabFormat: [
      "main-display",
      ["display-text", function() {return "["+format(player.e.points)+"]"}],
      "resource-display",
      ["display-text", function() {return "You have "+format(player.e.time)+" electric time"}],
      "blank",
      "clickables",
      "blank",
      "buyables",
      "blank",
      "upgrades",
      "blank",
    ],
    branches: ["a"],
    layerShown() {
      return hasAchievement("ach", 16);
    },
    buyables: {
      11: {
        title() {
          return format(getBuyableAmount(this.layer, this.id))+" ["+format(this.amount())+"]<br>Electric Pulse";
        },
        display() {
          return `Buy some Electric Pulses to increase electricity charge by electric time!
                            \nThe next Electric Pulse costs ${format(
                              this.cost()
                            )} electricity charge.
                            \nCurrently: +${format(this.effect())}`;
        },
        cost() {
          return getBuyableAmount(this.layer, this.id)
            .pow(1.2)
            .pow_base(1.2)
            .mul(5);
        },
        canAfford() {
          return player.e.points.gte(this.cost());
        },
        buy() {
          player.e.time = 0;
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return this.amount().mul(new Decimal(player.e.time).root(3)).div(2);
        },
        amount() {
          return getBuyableAmount(this.layer, this.id)
            .add(hasUpgrade('e', 22) ? getBuyableAmount('e', 13) : 0)
            .add(hasUpgrade('e', 22) ? getBuyableAmount('e', 12) : 0);
        },
        tooltip: "amt × cbrt time ÷ 2",
      },
      12: {
        title() {
          return format(getBuyableAmount(this.layer, this.id))+" ["+format(this.amount())+"]<br>Electric Current";
        },
        display() {
          return `Buy some Electric Currents to boost electricity charge by atoms!
                            \nThe next Electric Current costs ${format(
                              this.cost()
                            )} electricity charge.
                            \nCurrently: ×${format(this.effect())}`;
        },
        cost() {
          return getBuyableAmount(this.layer, this.id)
            .pow(1.5)
            .pow_base(1.5)
            .mul(50);
        },
        canAfford() {
          return player.e.points.gte(this.cost());
        },
        buy() {
          player.e.time = 0;
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return this.amount().pow_base(player.a.points.add(1).root(10));
        },
        amount() {
          return getBuyableAmount(this.layer, this.id)
            .add(hasUpgrade('e', 22) ? getBuyableAmount('e', 13) : 0);
        },
        unlocked() {
          return getBuyableAmount('e', 11).gte(10);
        },
        tooltip: "amt ^ 10rt atoms",
      },
      13: {
        title() {
          return format(getBuyableAmount(this.layer, this.id))+" ["+format(this.amount())+"]<br>Electric Prisms";
        },
        display() {
          return `Buy some Electric Prisms to boost electricity charge by neutrons!
                            \nThe next Electric Prism costs ${format(
                              this.cost()
                            )} electricity charge.
                            \nCurrently: ×${format(this.effect())}`;
        },
        cost() {
          return getBuyableAmount(this.layer, this.id)
            .pow(2)
            .pow_base(10)
            .mul("1e7");
        },
        canAfford() {
          return player.e.points.gte(this.cost());
        },
        buy() {
          player.e.time = 0;
          addBuyables(this.layer, this.id, 1);
        },
        effect() {
          return this.amount().pow_base(player.n.points.add(1).log(2).add(1).log(2).add(1));
        },
        amount() {
          return getBuyableAmount(this.layer, this.id);
        },
        unlocked() {
          return hasUpgrade('e', 21);
        },
        tooltip: "amt ^ log2 log2 neutrons",
      },
    },
    upgrades: {
      11: {
        description: "Electricity charge boosts itself and multiply quark gain by 20",
        cost: new Decimal(20), // might change
        effect() {
          return player.e.points
            .add(1)
            .log(10)
            .add(1);
        },
        effectDisplay() {
          return format(this.effect())+"×";
        },
        tooltip: "log10 electricity charge",
        pay() {
          player.e.time = 0;
        },
        canAfford() {return player.e.points.gte(this.cost)},
      },
      12: {
        description: "Divide atom requirements based on electricity charge and unlock electrons",
        cost: new Decimal(250),
        effect() {
          return player.e.points
            .add(1);
        },
        effectDisplay() {
          return format(this.effect())+"÷";
        },
        tooltip: "electricity charge",
        pay() {
          player.e.time = 0;
        },
        canAfford() {return player.e.points.gte(this.cost)},
      },
      13: {
        description: "Unlock a new element row",
        cost: new Decimal(250000),
        pay() {
          player.e.time = 0;
        },
        canAfford() {return player.e.points.gte(this.cost)},
      },
      21: {
        description: "Boost electricity charge by atoms and unlock an electricity charge buyable",
        cost: new Decimal("1e6"),
        effect() {
          return player.a.points
            .div(10)
            .add(1)
            .floor();
        },
        effectDisplay() {
          return format(this.effect())+"×";
        },
        tooltip: "atoms",
        pay() {
          player.e.time = 0;
        },
        canAfford() {return player.e.points.gte(this.cost)},
      },
      22: {
        description: "Each electricity buyable gives a bonus level to all previous buyables and you autobuy atoms without resetting",
        cost: new Decimal("2.5e10"),
        pay() {
          player.e.time = 0;
        },
        canAfford() {return player.e.points.gte(this.cost)},
      },
      23: {
        description: "Boost protons and neutrons and unlock... Coming Soon...",
        cost: new Decimal("3.14e12"),
        effect() {
          return player.e.points.add(1);
        },
        effectDisplay() {
          return format(this.effect())+"×";
        },
        pay() {
          player.e.time = 0;
        },
        canAfford() {return player.e.points.gte(this.cost)},
      },
    },
    clickables: {
      11: {
        title() {
          return "+"+formatWhole(this.effect().sub(player.e.electrons).max(1))+" Electrons";
        },
        display() {
          return formatWhole(player.e.electrons)+" Electrons, multiplying electricity charge by themselves";/*<br>Next at: "+format(
            player.e.electrons
            .div(buyableEffect('a', 33))
            .add(this.effect().max(0))
            .ceil()
            .pow(3)
            .root(2)
            .sub(62)
            .pow_base(10)
            .sub(1)
          )+" protons and neutrons";*/
        },
        canClick() {
          return this.effect().gt(player.e.electrons);
        },
        onClick() {
          player.e.electrons = this.effect();
          doReset('a');
        },
        effect() {
          return player.p.points
            .add(1)
            .log(10)
            .sub(62)
            .max(0)
            .mul(
              player.n.points
              .add(1)
              .log(10)
              .sub(62)
              .max(0)
            )
            .root(3)
            .mul(buyableEffect('a', 33))
            .floor();
        },
        unlocked() {
          return hasUpgrade('e', 12)
        },
        style() {
          return {
            'width': '250px',
          }
        },
      },
    },
  });
  