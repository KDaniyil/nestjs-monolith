import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import Redis from 'ioredis';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async create(dto: CreateOrderDto) {
    const { userId, orderProduct } = dto;

    await this.redis.del('orders_all');

    const order = await this.prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        orderProduct: {
          create: orderProduct.map((item) => ({
            productId: item.productId,
          })),
        },
      },
    });
    return order;
  }

  async findAll() {
    const cacheKey = 'orders_all';
    const cachedData = await this.redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const orders = this.prisma.order.findMany({
      include: {
        orderProduct: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    await this.redis.setex(cacheKey, 3600, JSON.stringify(orders));

    return orders;
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderProduct: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    const { userId, orderProduct } = dto;
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        user: { connect: { id: userId } },
        orderProduct: {
          deleteMany: {},
          create:
            orderProduct?.map((product) => ({
              productId: product.productId,
            })) || [],
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
