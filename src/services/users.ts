import bcrypt from "bcrypt";
import User from "../models/user";
import {
  NewUser,
  UpdatedUser,
} from "../types";
import Deck from "../models/deck";

const createUser = async (newUser: NewUser): Promise<User> => {
  const {
    email, name, surname, password,
  } = newUser;

  const passwordHash: string = await bcrypt.hash(password, 10);
  const savedUser: User = await User.create({
    email,
    name,
    surname,
    passwordHash,
  });

  const userNoHash: any = User.findByPk(savedUser.id, {
    attributes: { exclude: ["passwordHash"] },
  });

  return userNoHash;
};

const getUser = async (userId: string): Promise<User | null> => {
  const user: User | null = await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
  });
  return user;
};

const getAllUsers = async (): Promise<User[]> => User.findAll({
  include: [{
    model: Deck,
  }],
});

const updateUser = async (updatedUser: UpdatedUser, userId: number): Promise<User | null> => {
  const {
    email, name, surname, currentPassword, newPassword,
  } = updatedUser;

  const userToUpdate: User | null = await User.findByPk(userId);

  if (userToUpdate) {
    userToUpdate.set({
      ...userToUpdate,
      name: name || userToUpdate.name,
      surname: surname || userToUpdate.surname,
    });

    if (newPassword) {
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      const passwordCorrect = await bcrypt.compare(
        currentPassword as string,
        userToUpdate.passwordHash,
      );

      if (!(passwordCorrect)) {
        return null;
      }

      userToUpdate.passwordHash = newPasswordHash;
    }

    if (email) {
      const emailTaken: any = await User.findOne({
        where: {
          email,
        },
      });

      if (!emailTaken) {
        userToUpdate.email = email;
      }
    }
  } else {
    return null;
  }

  await userToUpdate.save();

  const userNoHash: any = await User.findByPk(userToUpdate.id, {
    attributes: { exclude: ["passwordHash"] },
  });

  return userNoHash;
};

const deleteUser = async (userId: string): Promise<User | null> => {
  const userToDelete: User | null = await User.findByPk(userId);
  if (userToDelete) {
    await userToDelete.destroy();
  }
  return userToDelete;
};

export default {
  createUser, getAllUsers, getUser, updateUser, deleteUser,
};
