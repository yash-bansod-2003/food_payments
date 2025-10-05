import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

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

  @Column({ type: "datetime" })
  validity: Date;

  @Column({ type: "int" })
  restaurantId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
