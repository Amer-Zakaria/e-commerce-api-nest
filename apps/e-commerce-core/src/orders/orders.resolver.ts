import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import CreateOrderInput from './dto/create-order.input';
import { ZodValidationPipe } from '../common/validation.pipe';
import { createOrderSchema } from './schemas/create-order.schema';
import { AuthzGuard } from '../common/authz.guard';
import { UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../common/permissions.guard';
import { PermissionsDec } from '../common/permissions.decorator';
import { Permissions } from '@app/contracts/common/permissions';
import objectIdSchema from '@app/contracts/common/objectIdSchema';
import { IOrder, Order } from './schemas/order.schema';
import { CheckExistenceService } from '../common/check-existence.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Resolver('Order')
export class OrdersResolver {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<IOrder>,
    private readonly checkExistenceService: CheckExistenceService,
    private readonly ordersService: OrdersService,
  ) {}

  @Mutation('createOrder')
  @UseGuards(AuthzGuard)
  create(
    @Args('createOrderInput', new ZodValidationPipe(createOrderSchema))
    createOrderInput: CreateOrderInput,
  ) {
    return this.ordersService.create(createOrderInput);
  }

  @Query('orders')
  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.VIEW_ORDERS])
  findAll() {
    return this.ordersService.findAll();
  }

  @Query('order')
  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.VIEW_ORDERS])
  async findOne(@Args('id', new ZodValidationPipe(objectIdSchema)) id: string) {
    const order = await this.checkExistenceService.check<IOrder>(
      this.orderModel,
      id,
    );

    return this.ordersService.findOne(order);
  }
}
