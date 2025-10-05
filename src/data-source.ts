import "reflect-metadata";
import { DataSource } from "typeorm";
import configuration from "./common/lib/configuration";
import { Customer } from "./customer/entity";
import path from "node:path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configuration.database.host,
  port: configuration.database.port,
  username: configuration.database.user,
  password: configuration.database.password,
  database: configuration.database.database,
  synchronize: false,
  logging: false,
  entities: [Customer],
  migrations: [path.join(__dirname, "migrations/**/*.{js,ts}")],
});
