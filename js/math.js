function getProdMultC() {
    accelMult = tmp.c.buyables["21"].effect
    multiMult = tmp.c.buyables["22"].effect
    return accelMult.mul(multiMult)
}