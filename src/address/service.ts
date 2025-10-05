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
import { Address } from "./entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class AddressesService {
  constructor(private readonly addressesRepository: Repository<Address>) {}
  /**
   * Create a new address in the database.
   *
   * @param createAddressDto The Address to be created, without an id.
   * @param options The options to be passed to the save method of the repository.
   * @returns A Promise that resolves to the created Address.
   */
  async create(createAddressDto: DeepPartial<Address>, options?: SaveOptions) {
    return await this.addressesRepository.save(createAddressDto, options);
  }

  /**
   * Retrieve all addresses from the database.
   *
   * @param options The options to be passed to the find method of the repository.
   * @returns A Promise that resolves to an array of Address objects.
   */
  async findAll(
    options?: FindManyOptions<Address>,
  ): Promise<[Address[], number]> {
    return await this.addressesRepository.findAndCount(options);
  }

  /**
   * Retrieve a single address from the database.
   *
   * @param options The options to be passed to the findOne method of the repository.
   * @returns A Promise that resolves to the Address, or null if no Address matches the criteria.
   */
  async findOne(options: FindOneOptions<Address>): Promise<Address | null> {
    return await this.addressesRepository.findOne(options);
  }

  /**
   * Update an address in the database.
   *
   * @param criteria The criteria to search for the address to be updated.
   * @param addressUpdateDto The Address object with the changes to be applied.
   * @returns A Promise that resolves to the result of the update operation.
   */
  async update(
    criteria: FindOptionsWhere<Address>,
    addressUpdateDto: QueryDeepPartialEntity<Address>,
  ): Promise<UpdateResult> {
    return await this.addressesRepository.update(criteria, addressUpdateDto);
  }

  /**
   * Delete an address from the database.
   *
   * @param criteria The criteria to search for the address to be deleted.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  async delete(criteria: FindOptionsWhere<Address>): Promise<DeleteResult> {
    return await this.addressesRepository.delete(criteria);
  }
}

export default AddressesService;
