import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

interface PriceConfiguration {
  [key: string]: {
    priceType: string;
    availableOptions: {
      [option: string]: number;
    };
  };
}

export interface ProductMessage {
  _id: string;
  name: string;
  priceConfigurations: PriceConfiguration;
  restaurentId: number;
}

@Entity("products")
export class Product {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "jsonb" })
  priceConfigurations: PriceConfiguration;

  @Column({ type: "int" })
  restaurantId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
