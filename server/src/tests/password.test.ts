import { validatePassword } from "../utils/password";

describe("Password Validator - White Box Testing", () => {
    // Test initial pour initialiser le rapport de couverture
    // Ce test ne couvre que la première ligne de la fonction (Branch 1)
    it("devrait rejeter un mot de passe vide", () => {
        const result = validatePassword(""
            , 25);
        expect(result).toBe(false);
    });
    it("devrait rejeter un mot de passe inférieur à 8 caractères", () => {
        const result = validatePassword("testinf"
            ,25);
        expect(result).toBe(false)
    });
    it("passer la vérification de longueur minimale", () => {
        const result = validatePassword("testsupp@123"
            ,25);
        expect(result).toBe(false)
    });
    it("devrait refuser un mot de passe supérieur à 20 caractères", () => {
        const result = validatePassword("testsupp@123fzgergeré'(§è!gregeer"
            ,25);
        expect(result).toBe(false)
    });
    it("devrait refuser les enfants de moins de 12 ans ET sans majuscules", () => {
        const result = validatePassword("TESTMAUVAIS@123"
            ,5);
        expect(result).toBe(false)
    });
    it("devrait refuser les enfants de moins de 12 ans ET sans minuscules", () => {
        const result = validatePassword("TESTMAUVAIS@123"
            ,5);
        expect(result).toBe(false)
    });
    it("devrait accepter les enfants de moins de 12 ans ET avec minuscules", () => {
        const result = validatePassword("TESTMaUVAIS123"
            ,5);
        expect(result).toBe(true)
    });
    it("devrait refuser si mdp n'a pas de majuscules", () => {
        const result = validatePassword("testmauvais123"
            ,45);
        expect(result).toBe(false)
    });
    it("devrait refuser si mdp n'a pas de minuscules", () => {
        const result = validatePassword("TESTMAUVAIS123"
            ,45);
        expect(result).toBe(false)
    });
    it("devrait refuser si mdp n'a pas de nombres", () => {
        const result = validatePassword("TESTMAUVAISaie"
            ,45);
        expect(result).toBe(false)
    });
    it("devrait accepter mdp avec MAJ,MIN et NBR sans caracères spécial", () => {
        const result = validatePassword("TESTbon123"
            ,45);
        expect(result).toBe(false)
    });
    it("devrait accepter la bonne typologie", () => {
        const result = validatePassword("TESTbon123@@"
            ,45);
        expect(result).toBe(true)
    });
    it("devrait refuser pour les vieux croulants si mdp n'a pas de NBR et MAJ", () => {
        const result = validatePassword("tesmuavais@"
            ,80);
        expect(result).toBe(false)
    });
    it("devrait accepter pour les vieux croulants", () => {
        const result = validatePassword("tesmAUvais@123"
            ,80);
        expect(result).toBe(true)
    });
});