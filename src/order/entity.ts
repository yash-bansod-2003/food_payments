import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Coupon } from "@/coupon/entity";
import { Customer } from "@/customer/entity";
import { Address } from "@/address/entity";
import { PaymentMode } from "./types";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  restaurantId: number;

  @Column({ type: "text", enum: PaymentMode })
  paymentMode: PaymentMode;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders, { nullable: true })
  coupon: Coupon;

  @ManyToOne(() => Address, (address) => address.orders, { nullable: true })
  address: Address;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
