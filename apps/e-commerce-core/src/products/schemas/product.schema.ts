import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Categories } from '../../graphql';

export type IVendor = HydratedDocument<Vendor>;
export type IProduct = HydratedDocument<Product>;

export const categories = Object.values(Categories);

@Schema({ _id: false, versionKey: false })
class Vendor {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  bio: string;
}

@Schema({ versionKey: false })
export class Product {
  @Prop({
    type: Vendor,
  })
  vendor: IVendor;

  @Prop({
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    lowercase: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  quantity: number;

  @Prop({
    type: String,
    enum: {
      values: categories,
      message: '{VALUE} is not supported',
    },
    default: null,
  })
  category: (typeof categories)[number];

  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.length >= 1;
      },
      message: 'at least one tag is required',
    },
  })
  tags: string[];

  @Prop({
    type: Date,
    default: () => new Date(),
    immutable: true,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  updatedAt: Date;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({
    type: Number,
    required: function (this: IProduct) {
      return this.isActive ? true : false;
    },
    min: 10,
    get: (v: number) => Math.round(v),
    set: (v: number) => Math.round(v),
  })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
// export const ProductModel = model<Product>(
//   'products',
//   ProductSchema,
// ) as Model<IProduct>;

ProductSchema.pre('save', function (next) {
  (<IProduct>this).updatedAt = new Date();
  next();
});

ProductSchema.post('save', (product, next) => {
  console.log(`product "${product.name}" has been saved successfully`);
  next();
});
