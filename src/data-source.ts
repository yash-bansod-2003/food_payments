import "reflect-metadata";
import { DataSource } from "typeorm";
import configuration from "./common/lib/configuration";
import { Customer } from "./customer/entity";
import { Address } from "./address/entity";
import { Coupon } from "./coupon/entity";
import { Order } from "./order/entity";
import { Product } from "./product/entity";
import { Topping } from "./toppings/entity";

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
  entities: [Customer, Address, Coupon, Order, Product, Topping],
  migrations: [path.join(__dirname, "migrations/**/*.{js,ts}")],
});
