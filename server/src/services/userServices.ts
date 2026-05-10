import prisma from "../config/prisma.js";

type UpdateProfileInput = {
  username?: string;
  email?: string;
};

type UpdatePasswordInput = {
  password_hash?: string;
};

type UpdateActiveInput = {
  isActive?: boolean;
};

export const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      created_at: true,
      addresses: true,
      roles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const updateUserProfile = async (userId: number, input: UpdateProfileInput) => {
  const data: UpdateProfileInput = {};

  if (input.username !== undefined) data.username = input.username;
  if (input.email !== undefined) data.email = input.email;

  if (Object.keys(data).length === 0) {
    throw new Error("NO_USER_DATA");
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const updateUserPassword = async (userId: number, input: UpdatePasswordInput) => {
  const data: UpdatePasswordInput = {};

  if (input.password_hash !== undefined) {
    data.password_hash = input.password_hash;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("NO_USER_DATA");
  }

  return prisma.credentials.update({
    where: { user_id: userId },
    data,
  });
};

export const updateUserActiveStatus = async (userId: number, input: UpdateActiveInput) => {
  const data: UpdateActiveInput = {};

  if (input.isActive !== undefined) {
    data.isActive = input.isActive;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("NO_USER_DATA");
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
};
