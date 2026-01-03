import { Product } from "./entity";
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { AppDataSource } from "@/data-source";

class ProductService {
  constructor(private readonly productRepository: Repository<Product>) { }

  async create(
    createProductDto: DeepPartial<Product>,
    options?: SaveOptions,
  ) {
    return await this.productRepository.save(createProductDto, options);
  }

  findAll(
    options?: FindManyOptions<Product>,
  ): Promise<[Product[], number]> {
    return this.productRepository.findAndCount(options);
  }

  findOne(options: FindOneOptions<Product>): Promise<Product | null> {
    return this.productRepository.findOne(options);
  }

  update(
    criteria: FindOptionsWhere<Product>,
    updateProductDto: QueryDeepPartialEntity<Product>,
  ): Promise<UpdateResult> {
    return this.productRepository.update(criteria, updateProductDto);
  }

  delete(criteria: FindOptionsWhere<Product>): Promise<DeleteResult> {
    return this.productRepository.delete(criteria);
  }

  /**
   *
   * @returns A QueryBuilder for the Product entity, allowing for complex queries to be built.
   * This can be used to perform operations like joins, where conditions, and more.
   */
  getQueryBuilder(alias: string): SelectQueryBuilder<Product> {
    return this.productRepository.createQueryBuilder(alias);
  }
}

const productRepository = AppDataSource.getRepository(Product);
export const productService = new ProductService(productRepository);
