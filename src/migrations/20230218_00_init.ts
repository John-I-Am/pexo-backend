import { DataTypes } from "sequelize";

export = {
  up: async ({ context: queryInterface }: any) => {
    await queryInterface.createTable("decks", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: "untitled",
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable("cards", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      front: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      back: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      audio: {
        type: DataTypes.STRING,
      },
      examples: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
        },
      },
      checkpoint_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addColumn("cards", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    });
    await queryInterface.addColumn("cards", "deck_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "decks", key: "id" },
    });
    await queryInterface.addColumn("decks", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    });
  },
  down: async ({ context: queryInterface }: any) => {
    await queryInterface.dropTable("cards");
    await queryInterface.dropTable("decks");
    await queryInterface.dropTable("users");
  },
};
