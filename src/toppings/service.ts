import { Topping } from "./entity";
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

class ToppingService {
  constructor(private readonly toppingRepository: Repository<Topping>) { }

  async create(createToppingDto: DeepPartial<Topping>, options?: SaveOptions) {
    return await this.toppingRepository.save(createToppingDto, options);
  }

  findAll(options?: FindManyOptions<Topping>): Promise<[Topping[], number]> {
    return this.toppingRepository.findAndCount(options);
  }

  findOne(options: FindOneOptions<Topping>): Promise<Topping | null> {
    return this.toppingRepository.findOne(options);
  }

  update(
    criteria: FindOptionsWhere<Topping>,
    updateToppingDto: QueryDeepPartialEntity<Topping>,
  ): Promise<UpdateResult> {
    return this.toppingRepository.update(criteria, updateToppingDto);
  }

  delete(criteria: FindOptionsWhere<Topping>): Promise<DeleteResult> {
    return this.toppingRepository.delete(criteria);
  }

  /**
   *
   * @returns A QueryBuilder for the Topping entity, allowing for complex queries to be built.
   * This can be used to perform operations like joins, where conditions, and more.
   */
  getQueryBuilder(alias: string): SelectQueryBuilder<Topping> {
    return this.toppingRepository.createQueryBuilder(alias);
  }
}

const toppingRepository = AppDataSource.getRepository(Topping);
export const toppingService = new ToppingService(toppingRepository);
export default ToppingService;