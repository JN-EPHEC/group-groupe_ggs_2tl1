import prisma from "../config/prisma.js";

type AdresseInput = {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

type AdresseUpdateInput = Partial<AdresseInput>;

export const allAdresses = async (userId: number) => {
    const adresses = await prisma.address.findMany({
        where: { user_id: userId },
        orderBy: { id: "asc" },
    })

    return adresses;
}

export const createAdress = async (userId: number, input: AdresseInput) => {
    const address = await prisma.address.create({
        data: {
            user_id: userId,
            street: input.street,
            city: input.city,
            state: input.state,
            postalCode: input.postalCode,
            country: input.country,
        },
    });

    return address;
}

export const updateAdress = async (
    userId: number,
    addressId: number,
    input: AdresseUpdateInput
) => {
    const data: AdresseUpdateInput = {};

    if (input.street !== undefined) data.street = input.street;
    if (input.city !== undefined) data.city = input.city;
    if (input.state !== undefined) data.state = input.state;
    if (input.postalCode !== undefined) data.postalCode = input.postalCode;
    if (input.country !== undefined) data.country = input.country;

    if (Object.keys(data).length === 0) {
        throw new Error("NO_ADDRESS_DATA");
    }

    const existingAddress = await prisma.address.findFirst({
        where: {
            id: addressId,
            user_id: userId,
        },
    });

    if (!existingAddress) {
        throw new Error("ADDRESS_NOT_FOUND");
    }

    const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data,
    });

    return updatedAddress;
}

export const deleteAdress = async (userId: number, addressId: number) => {
    const existingAddress = await prisma.address.findFirst({
        where: {
            id: addressId,
            user_id: userId,
        },
    });

    if (!existingAddress) {
        throw new Error("ADDRESS_NOT_FOUND");
    }

    await prisma.address.delete({
        where: { id: addressId },
    });

    return null;
}
