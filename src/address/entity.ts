import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Customer } from "@/customer/entity";

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
