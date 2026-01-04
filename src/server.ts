import "reflect-metadata";
import path from "node:path";
import express, { ErrorRequestHandler, Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import customerRouter from "@/customer/router";
import addressRouter from "@/address/router";
import couponRouter from "@/coupon/router";
import ordersRouter from "@/order/router";
import errorHandler from "@/common/middlewares/error-handler";
import configuration from "@/common/lib/configuration";

export const createServer = (): Express => {
  const app = express();
  app
    .use(
      cors({
        origin: [configuration.cookies.domain],
        credentials: true,
      }),
    )
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(morgan("dev"))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, "..", "public")))
    .get("/status", (_, res) => {
      res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      res.json({ message: `hello ${req.params.name}` });
    })
    .use("/customers", customerRouter)
    .use("/addresses", addressRouter)
    .use("/coupons", couponRouter)
    .use("/orders", ordersRouter)
    .use(errorHandler as unknown as ErrorRequestHandler);
  return app;
};
