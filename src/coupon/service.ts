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
import { Coupon } from "./entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class CouponsService {
  constructor(private readonly couponsRepository: Repository<Coupon>) {}
  /**
   * Create a new coupon in the database.
   *
   * @param createCouponDto The Coupon to be created, without an id.
   * @param options The options to be passed to the save method of the repository.
   * @returns A Promise that resolves to the created Coupon.
   */
  async create(createCouponDto: DeepPartial<Coupon>, options?: SaveOptions) {
    return await this.couponsRepository.save(createCouponDto, options);
  }

  /**
   * Retrieve all coupons from the database.
   *
   * @param options The options to be passed to the find method of the repository.
   * @returns A Promise that resolves to an array of Coupon objects.
   */
  async findAll(
    options?: FindManyOptions<Coupon>,
  ): Promise<[Coupon[], number]> {
    return await this.couponsRepository.findAndCount(options);
  }

  /**
   * Retrieve a single coupon from the database.
   *
   * @param options The options to be passed to the findOne method of the repository.
   * @returns A Promise that resolves to the Coupon, or null if no Coupon matches the criteria.
   */
  async findOne(options: FindOneOptions<Coupon>): Promise<Coupon | null> {
    return await this.couponsRepository.findOne(options);
  }

  /**
   * Update a coupon in the database.
   *
   * @param criteria The criteria to search for the coupon to be updated.
   * @param couponUpdateDto The Coupon object with the changes to be applied.
   * @returns A Promise that resolves to the result of the update operation.
   */
  async update(
    criteria: FindOptionsWhere<Coupon>,
    couponUpdateDto: QueryDeepPartialEntity<Coupon>,
  ): Promise<UpdateResult> {
    return await this.couponsRepository.update(criteria, couponUpdateDto);
  }

  /**
   * Delete a coupon from the database.
   *
   * @param criteria The criteria to search for the coupon to be deleted.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  async delete(criteria: FindOptionsWhere<Coupon>): Promise<DeleteResult> {
    return await this.couponsRepository.delete(criteria);
  }
}

export default CouponsService;
