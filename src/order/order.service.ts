import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const { userId, orderProduct } = dto;
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
    return this.prisma.order.findMany({
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
