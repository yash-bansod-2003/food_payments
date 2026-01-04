import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Customer } from "@/customer/entity";
import { Order } from "@/order/entity";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  line1: string;

  @Column({ type: "text", nullable: true })
  line2: string;

  @Column({ type: "text" })
  city: string;

  @Column({ type: "text" })
  state: string;

  @Column({ type: "text" })
  postal_code: string;

  @Column({ type: "text" })
  country: string;

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    onDelete: "CASCADE",
  })
  customer: Customer;

  @OneToMany(() => Order, (order) => order.id)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
