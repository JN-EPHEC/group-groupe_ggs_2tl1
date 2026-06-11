import prisma from "../config/prisma.js";

export const allCategories = async () => {
    const categories = await prisma.categories.findMany({});

    return categories;
}

export const oneCat = async (input: number) => {
    const categorie = await prisma.categories.findUnique({
        where: { id: Number(input)}
    })

    if (!categorie) {
            throw new Error("CAT_NOT_FOUND")
        };

    return categorie;
}