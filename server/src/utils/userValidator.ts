export function validateUserRegistration(age: number, role: string, email: string) {
    const AGEMAX = 120;
    const MAJEUR= 18;
    const ROLESVALIDES = ["stagiaire","user","admin"]

    if(isNaN(age) || age > AGEMAX) {
        throw new Error("Âge invalide");
    }
    if(!ROLESVALIDES.includes(role)) {
        throw new Error("Rôle invalide")
    }

    if (age < MAJEUR) {
        if(role === "stagiaire") {
            return true;
        }
        else return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
    return false;
    }

    else return true;

}