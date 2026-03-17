import { validateUserRegistration } from "../utils/userValidator";

describe("User Validator - White Box Testing", () => {
    //test de la fonction de validation de l'enregistrement d'un utilisateur
    it("devrait rejeter un age qui n'est pas un nombre", () => {
        expect(() =>
            validateUserRegistration("test" as unknown as number, "user", "test@gmail.com")
        ).toThrow("Âge invalide");
    });
    it("devrait rejeter un âge supérieur à 120 ans", () => {
        expect(() =>
            validateUserRegistration(121,"user", "test@gmail.com")
        ).toThrow("Âge invalide");
    })
    it("devrait rejeter si le role est pas inclus dans les bons roles", () => {
        expect(() =>
            validateUserRegistration(21,"chien", "test@gmail.com")
        ).toThrow("Rôle invalide");
    })
    it("devrait rejeter un mineur", () => {
        const result = validateUserRegistration(17,"user", "test@gmail.com")
        expect(result).toBe(false)
    });
    it("devrait accepter un stagiare mineur", () => {
        const result = validateUserRegistration(17,"stagiaire", "test@gmail.com")
        expect(result).toBe(true)
    });
    it("devrait refuser une adresse qui ne contient aps @ ni .", () => {
        const result = validateUserRegistration(24,"admin", "testgmailcom")
        expect(result).toBe(false)
    });
    it("devrait accepter si tius les paramètres ont bons", () => {
        const result = validateUserRegistration(24,"admin", "test@gmail.com")
        expect(result).toBe(true)
    });
})