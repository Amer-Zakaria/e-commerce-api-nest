import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CheckUniquenessService } from 'apps/e-commerce-core/src/common/check-uniqueness.service';
import { ProductsResolver } from './products.resolver';
import { CheckExistenceService } from '../common/check-existence.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [
    ProductsService,
    CheckUniquenessService,
    CheckExistenceService,
    ProductsResolver,
  ],
  exports: [MongooseModule],
})
export class ProductsModule {}
