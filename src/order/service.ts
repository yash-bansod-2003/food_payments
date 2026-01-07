import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from "typeorm";
import { Order } from "./entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class OrdersService {
  constructor(private readonly ordersRepository: Repository<Order>) { }
  /**
   * Create a new order in the database.
   *
   * @param createOrderDto The Order to be created, without an id.
   * @param options The options to be passed to the save method of the repository.
   * @returns A Promise that resolves to the created Order.
   */
  async create(createOrderDto: DeepPartial<Order>, options?: SaveOptions) {
    return await this.ordersRepository.save(createOrderDto, options);
  }

  /**
   * Retrieve all orders from the database.
   *
   * @param options The options to be passed to the find method of the repository.
   * @returns A Promise that resolves to an array of Order objects.
   */
  async findAll(options?: FindManyOptions<Order>): Promise<[Order[], number]> {
    return await this.ordersRepository.findAndCount(options);
  }

  /**
   * Retrieve a single order from the database.
   *
   * @param options The options to be passed to the findOne method of the repository.
   * @returns A Promise that resolves to the Order, or null if no Order matches the criteria.
   */
  async findOne(options: FindOneOptions<Order>): Promise<Order | null> {
    return await this.ordersRepository.findOne(options);
  }

  /**
   * Update an order in the database.
   *
   * @param criteria The criteria to search for the order to be updated.
   * @param orderUpdateDto The Order object with the changes to be applied.
   * @returns A Promise that resolves to the result of the update operation.
   */
  async update(
    criteria: FindOptionsWhere<Order>,
    orderUpdateDto: QueryDeepPartialEntity<Order>,
  ): Promise<UpdateResult> {
    return await this.ordersRepository.update(criteria, orderUpdateDto);
  }

  /**
   * Delete an order from the database.
   *
   * @param criteria The criteria to search for the order to be deleted.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  async delete(criteria: FindOptionsWhere<Order>): Promise<DeleteResult> {
    return await this.ordersRepository.delete(criteria);
  }
}

export default OrdersService;
