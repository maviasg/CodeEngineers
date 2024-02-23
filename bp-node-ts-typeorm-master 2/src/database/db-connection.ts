import path from "path";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import {
  TYPEORM_HOST,
  TYPEORM_PORT,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_LOGGING,
} from "../config/secret";

export const dbConnection = new DataSource({
  type: "postgres",
  host: TYPEORM_HOST,
  port: Number(TYPEORM_PORT),
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  entities: [path.resolve(`${__dirname}/model/*.{js,ts}`)],
  migrations: [`${__dirname}/migration/*`],
  migrationsTableName: "migrations",
  synchronize: false,
  logging: Boolean(TYPEORM_LOGGING), // true => make it to true to log the sql queries
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: true,
});
