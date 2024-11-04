import { ProductsService } from './products.service';
import CreateProductDto from './dto/create-product.dto';
import { ZodValidationPipe } from '../common/validation.pipe';
import { createProductSchema } from './schemas/create-product.schema';
import { IProduct } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { updateProductSchema } from './schemas/update-product.schema';
import { UseGuards } from '@nestjs/common';
import { AuthzGuard } from '../common/authz.guard';
import { PermissionsDec } from '../common/permissions.decorator';
import { Permissions } from '@app/contracts/common/permissions';
import { PermissionsGuard } from '../common/permissions.guard';
import objectIdSchema from '@app/contracts/common/objectIdSchema';
import { CheckExistenceService } from '../common/check-existence.service';
import { CheckUniquenessService } from '../common/check-uniqueness.service';

@Resolver()
export class ProductsResolver {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<IProduct>,
    private readonly productsService: ProductsService,
    private readonly checkUniqunessService: CheckUniquenessService,
    private readonly checkExistenceService: CheckExistenceService,
  ) {}

  @Mutation('createProduct')
  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.CREATE_PRODUCT])
  async create(
    @Args('createProductInput', new ZodValidationPipe(createProductSchema))
    createProductDto: CreateProductDto,
  ) {
    await this.checkUniqunessService.check(
      this.productModel,
      'name',
      createProductDto.name,
    );

    return this.productsService.create(createProductDto);
  }

  @Mutation('updateProduct')
  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.UPDATE_PRODUCT])
  async update(
    @Args('id', new ZodValidationPipe(objectIdSchema)) id: string,
    @Args('updateProductInput', new ZodValidationPipe(updateProductSchema))
    updateProductDto: CreateProductDto,
  ) {
    const product = await this.checkExistenceService.check<IProduct>(
      this.productModel,
      id,
    );

    await this.checkUniqunessService.check(
      this.productModel,
      'name',
      updateProductDto.name,
    );

    return this.productsService.update(product, updateProductDto);
  }

  @Query('products')
  findAll() {
    return this.productsService.findAll();
  }

  @Query('product')
  async findOneById(
    @Args('id', new ZodValidationPipe(objectIdSchema))
    id: string,
  ) {
    const product = await this.checkExistenceService.check<IProduct>(
      this.productModel,
      id,
    );

    return product;
  }

  @Mutation('deleteProduct')
  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.DELETE_PRODUCT])
  async delete(@Args('id', new ZodValidationPipe(objectIdSchema)) id: string) {
    const product = await this.checkExistenceService.check<IProduct>(
      this.productModel,
      id,
    );

    return this.productsService.delete(product);
  }

  @Mutation('switchIsActive')
  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.ACTIVATE_PRODUCT])
  async switchIsActive(
    @Args('id', new ZodValidationPipe(objectIdSchema)) id: string,
  ) {
    const product = await this.checkExistenceService.check<IProduct>(
      this.productModel,
      id,
    );

    return this.productsService.switchIsActive(product);
  }
}
