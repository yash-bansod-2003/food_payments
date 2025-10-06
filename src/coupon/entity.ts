import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Order } from "@/order/entity";

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", unique: true })
  code: string;

  @Column({ type: "int" })
  discount: number;

  @Column({ type: "timestamp" })
  validity: Date;

  @Column({ type: "int" })
  restaurantId: number;

  @OneToMany(() => Order, (order) => order.id)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
