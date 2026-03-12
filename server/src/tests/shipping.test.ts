import { calculateShipping } from "../utils/shipping"

const distancesCases = [
    //[Dist, Poids, Type, Attendu, Description]
    [0, 5, "standard", 10, "Distance faible, poids faible, livraison standard"],
    [0, 15, "standard", 15, "Distance faible, poids middle, livraison standard"],
    [0, 5, "express", 20, "Distance faible, poids faible, livraison express"],
    [0, 15, "express", 30, "Distance faible, poids middle, livraison express"],
    [75, 5, "standard", 25, "Distance middle, poids faible, livraison standard"],
    [75, 15, "standard", 37.5, "Distance middle, poids middle, livraison standard"],
    [75, 5, "express", 50, "Distance middle, poids faible, livraison express"],
    [75, 15, "express", 75, "Distance middle, poids middle, livraison express"],
    [800, 5, "standard", 50, "Distance longue, poids faible, livraison standard"],
    [800, 15, "standard", 75, "Distance longue, poids middle, livraison standard"],
    [800, 5, "express", 100, "Distance longue, poids faible, livraison express"],
    [800, 15, "express", 150, "Distance longue, poids middle, livraison express"]
]

describe('shipping test', () => {
    it.each(distancesCases)("devrait calculer avec distance : %d km, poids : %d kg,types : %s",
        (distance,weight,type,expected, description) => {
            const result = calculateShipping(distance,weight, type)
            expect(result).toBe(expected)
        }
    )   
})