import { BadRequestException, Injectable } from '@nestjs/common';
import CreateProductDto from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, IProduct } from './schemas/product.schema';
import { Error, Model } from 'mongoose';
import { ERROR_TYPE } from '@app/contracts/error/error-types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<IProduct>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = new this.productModel({
      ...createProductDto,
    });

    const createdProduct = await product.save().catch((err) => {
      throw new BadRequestException(ERROR_TYPE.MONGOOSE, { cause: err });
    });

    return createdProduct;
  }

  async update(product: IProduct, updateProductDto: UpdateProductDto) {
    if (product.isActive) {
      throw new BadRequestException(ERROR_TYPE.CUSTOM_VALIDATION, {
        cause: "Product is active we can't mess with it",
      });
    }

    product.set(updateProductDto);

    const savedProduct = await product
      .save()
      .catch((err: Error.ValidationError) => {
        throw new BadRequestException(ERROR_TYPE.MONGOOSE, { cause: err });
      });

    return savedProduct;
  }

  findAll() {
    return this.productModel.find();
  }

  async delete(product: IProduct) {
    await product.deleteOne();

    return product;
  }

  switchIsActive(product: IProduct) {
    product.set({
      isActive: !product.isActive,
    });

    return product.save().catch((err: Error.ValidationError) => {
      throw new BadRequestException(ERROR_TYPE.MONGOOSE, { cause: err });
    });
  }
}
