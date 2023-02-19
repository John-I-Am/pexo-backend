import usersService from "../services/users";
import User from "../models/user";
import db from "../utils/db";

jest.mock("bcrypt", () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
}));

describe("usersService works", () => {
  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  it("should be possible to add user", async () => {
    const newUser: any = {
      email: "test@test.com",
      name: "Test",
      surname: "User",
      password: "testpassword",
    };

    const mockUser: any = {
      id: 1,
      email: newUser.email,
      name: newUser.name,
      surname: newUser.surname,
      passwordHash: "hashed_testpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(User, "create").mockResolvedValueOnce(mockUser);
    jest.spyOn(User, "findByPk").mockResolvedValueOnce({
      ...mockUser,
      passwordHash: undefined,
    });

    await usersService.createUser(newUser);

    expect(User.create).toHaveBeenCalledWith({
      email: newUser.email,
      name: newUser.name,
      surname: newUser.surname,
      passwordHash: "hashed_testpassword",
    });
  });

  it("should throw an error if user is invalid", async () => {
    const newUser: any = {
      email: "test@test.com",
      name: "Test",
      surname: "User",
      password: "testpassword",
    };
    jest.spyOn(User, "create").mockRejectedValueOnce(new Error("Failed to create user"));

    await expect(usersService.createUser(newUser)).rejects.toThrow("Failed to create user");
  });

  it("should throw an error if user creation fails", async () => {
    const newUser: any = {
      email: "test@test.com",
      name: "Test",
      surname: "User",
      password: "testpassword",
    };
    jest.spyOn(User, "create").mockRejectedValueOnce(new Error("Failed to create user"));

    await expect(usersService.createUser(newUser)).rejects.toThrow("Failed to create user");
  });

  afterAll(() => {
    jest.clearAllMocks();
    db.sequelize.close();
  });
});
