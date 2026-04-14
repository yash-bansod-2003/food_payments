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
import { Customer } from "./entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { AppDataSource } from "@/data-source";

class CustomersService {
  constructor(private readonly customersRepository: Repository<Customer>) { }
  /**
   * Create a new customer in the database.
   *
   * @param createCustomerDto The Customer to be created, without an id.
   * @param options The options to be passed to the save method of the repository.
   * @returns A Promise that resolves to the created Customer.
   */
  async create(
    createCustomerDto: DeepPartial<Customer>,
    options?: SaveOptions,
  ) {
    return await this.customersRepository.save(createCustomerDto, options);
  }

  /**
   * Retrieve all customers from the database.
   *
   * @param options The options to be passed to the find method of the repository.
   * @returns A Promise that resolves to an array of Customer objects.
   */
  async findAll(
    options?: FindManyOptions<Customer>,
  ): Promise<[Customer[], number]> {
    return await this.customersRepository.findAndCount(options);
  }

  /**
   * Retrieve a single customer from the database.
   *
   * @param options The options to be passed to the findOne method of the repository.
   * @returns A Promise that resolves to the Customer, or null if no Customer matches the criteria.
   */
  async findOne(options: FindOneOptions<Customer>): Promise<Customer | null> {
    return await this.customersRepository.findOne(options);
  }

  /**
   * Update a customer in the database.
   *
   * @param criteria The criteria to search for the customer to be updated.
   * @param customerUpdateDto The Customer object with the changes to be applied.
   * @returns A Promise that resolves to the result of the update operation.
   */
  async update(
    criteria: FindOptionsWhere<Customer>,
    customerUpdateDto: QueryDeepPartialEntity<Customer>,
  ): Promise<UpdateResult> {
    return await this.customersRepository.update(criteria, customerUpdateDto);
  }

  /**
   * Delete a customer from the database.
   *
   * @param criteria The criteria to search for the customer to be deleted.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  async delete(criteria: FindOptionsWhere<Customer>): Promise<DeleteResult> {
    return await this.customersRepository.delete(criteria);
  }
}

const customersRepository = AppDataSource.getRepository(Customer);
const customerService = new CustomersService(customersRepository);
export default CustomersService;
export { customerService };
