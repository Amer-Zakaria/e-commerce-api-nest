import { BadRequestException, Injectable } from '@nestjs/common';
import CreateOrderInput from './dto/create-order.input';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Error, Model } from 'mongoose';
import { IProduct, Product } from '../products/schemas/product.schema';
import { ERROR_TYPE } from '@app/contracts/error/error-types';
import { IOrder, Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Product.name)
    private readonly productModel: Model<IProduct>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<IOrder>,
  ) {}

  async create(createOrderInput: CreateOrderInput) {
    // VALIDATING THE PRODUCTS
    const products = await Promise.all(
      createOrderInput.products.map((product) =>
        this.productModel
          .findById(product.id)
          .select({ name: 1, price: 1, isActive: 1, quantity: 1 })
          .then((p) => {
            let errorMessage: null | string = null;
            if (!p)
              errorMessage = `Product with the id ${product.id} doesn't exist`;
            else if (!p.isActive)
              errorMessage = `Product with the name "${p.name}" is inactive`;
            else if (p.quantity - product.orderedQuantity < 0)
              errorMessage = `Product with the name "${p.name}" doesn't have enough quantity, current quantity availabe: ${p.quantity}`;

            if (errorMessage)
              throw new BadRequestException(ERROR_TYPE.CUSTOM_VALIDATION, {
                cause: errorMessage,
              });

            return p;
          }),
      ),
    );

    //CREATING THE ORDER & UPDATING THE PRODUCTS' STOCK ACCORDINGLY AS A TRANSACTION
    //===Transaction Starts
    const session = await this.connection.startSession();
    session.startTransaction();

    const createdOrder = await this.orderModel
      .create(
        [
          // Array so you can add the sessino object
          {
            ...createOrderInput,
            products: products?.map((product) => ({
              product: product?._id,
              capturedName: product?.name,
              capturedPrice: product?.price,
              orderedQuantity: createOrderInput.products.find(
                (p) => p.id === product?._id.toString(),
              )?.orderedQuantity,
            })),
          },
        ],
        { session },
      )
      .catch((err: Error.ValidationError) => {
        throw new BadRequestException(400, { cause: err });
      });

    // Updateing the products stock
    for (const product of createOrderInput.products) {
      const p = await this.productModel.findById(product.id).session(session);
      if (p) p.quantity = p.quantity - product.orderedQuantity;
      await p?.save();
    }

    await session.commitTransaction();
    await session.endSession();
    //===Transaction Ends

    return createdOrder[0];
  }

  findAll() {
    return this.orderModel.find();
  }

  findOne(order: IOrder) {
    return order.populate('products.product');
  }
}
