import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { IProduct, Product } from '../../products/schemas/product.schema';

export type IOrder = HydratedDocument<Order>;

export const orderStatusList = [
  'waitingDelivery',
  'canceled',
  'delivering',
  'delivered',
] as const;

@Schema({ versionKey: false })
export class Order {
  @Prop({
    type: String,
    enum: { values: orderStatusList, message: '{VALUE} is not supported' },
    default: orderStatusList[0],
  })
  status: (typeof orderStatusList)[number]; //convert js array to ts enum

  @Prop({
    type: [
      new MongooseSchema(
        {
          product: {
            type: String,
            rqeuired: true,
            ref: Product.name,
          },
          capturedName: { type: String, required: true },
          capturedPrice: { type: Number, required: true },
          orderedQuantity: { type: Number, required: true },
        },
        { _id: false },
      ),
    ],
  })
  products: {
    product: IProduct;
    capturedName: string;
    capturedPrice: number;
    orderedQuantity: number;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
