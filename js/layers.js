addLayer("c", {
    name: "chess", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#AAAAAA",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side",
    layerShown(){return true},
    tooltip: ""
})