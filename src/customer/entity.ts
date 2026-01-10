import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Address } from "@/address/entity";
import { Order } from "@/order/entity";

export interface CustomerMessage {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  firstname: string;

  @Column({ type: "text" })
  lastname: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "text", default: false })
  payment_gateway_customer_id: string;

  @OneToMany(() => Address, (address) => address.customer)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.id)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
