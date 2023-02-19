import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import config from "./config";
import logger from "./logger";

const sequelize: any = new Sequelize(config.DATABASE_URL as string, {
  dialectOptions: {
    ssl: process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
      ? null
      : {
        require: true,
        rejectUnauthorized: false,
      },
  },
  logging: false,
});

const migrationConf: any = {
  migrations: {
    glob: "src/migrations/*.{js,ts}",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator: any = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig: any) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== "test") {
      await runMigrations();
    }

    logger.info("connected to database", config.DATABASE_URL);
  } catch (error: any) {
    logger.error("failed to connect to the database", error.message);
    return process.exit(1);
  }
  return null;
};

export default { connectToDatabase, sequelize, rollbackMigration };
