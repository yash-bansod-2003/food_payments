import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Address } from "@/address/entity";

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

  @OneToMany(() => Address, (address) => address.customer)
  addresses: Address[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
