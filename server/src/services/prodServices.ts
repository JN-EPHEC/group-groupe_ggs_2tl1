import prisma from "../config/prisma.js";

export const allProduct = async () => {
    const products = await prisma.products.findMany({});

    if (products.length === 0){
        throw new Error("PRODUCTS_NOT_FOUND");
    }

    return products;
}

export const oneProduct = async (id: number) => {
    const product = await prisma.products.findUnique({
        where: { id }
    });
    if (!product){
        throw new Error("PRODUCT_NOT_FOUND");
        }
    return product;
}
