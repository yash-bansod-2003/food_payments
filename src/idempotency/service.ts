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
import { Idempotency } from "./entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class IdempotencyService {
  constructor(
    private readonly idempotencyRepository: Repository<Idempotency>,
  ) {}
  /**
   * Create a new idempotency record in the database.
   *
   * @param createIdempotencyDto The Idempotency to be created, without an id.
   * @param options The options to be passed to the save method of the repository.
   * @returns A Promise that resolves to the created Idempotency.
   */
  async create(
    createIdempotencyDto: DeepPartial<Idempotency>,
    options?: SaveOptions,
  ) {
    return await this.idempotencyRepository.save(createIdempotencyDto, options);
  }

  /**
   * Retrieve all idempotency records from the database.
   *
   * @param options The options to be passed to the find method of the repository.
   * @returns A Promise that resolves to an array of Idempotency objects.
   */
  async findAll(
    options?: FindManyOptions<Idempotency>,
  ): Promise<[Idempotency[], number]> {
    return await this.idempotencyRepository.findAndCount(options);
  }

  /**
   * Retrieve a single idempotency record from the database.
   *
   * @param options The options to be passed to the findOne method of the repository.
   * @returns A Promise that resolves to the Idempotency, or null if no Idempotency matches the criteria.
   */
  async findOne(
    options: FindOneOptions<Idempotency>,
  ): Promise<Idempotency | null> {
    return await this.idempotencyRepository.findOne(options);
  }

  /**
   * Update an idempotency record in the database.
   *
   * @param criteria The criteria to search for the idempotency record to be updated.
   * @param idempotencyUpdateDto The Idempotency object with the changes to be applied.
   * @returns A Promise that resolves to the result of the update operation.
   */
  async update(
    criteria: FindOptionsWhere<Idempotency>,
    idempotencyUpdateDto: QueryDeepPartialEntity<Idempotency>,
  ): Promise<UpdateResult> {
    return await this.idempotencyRepository.update(
      criteria,
      idempotencyUpdateDto,
    );
  }

  /**
   * Delete an idempotency record from the database.
   *
   * @param criteria The criteria to search for the idempotency record to be deleted.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  async delete(criteria: FindOptionsWhere<Idempotency>): Promise<DeleteResult> {
    return await this.idempotencyRepository.delete(criteria);
  }
}

export default IdempotencyService;
