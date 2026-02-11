import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModel } from '../enums/prisma-model.enum';

@Injectable()
export class BaseResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly model: string,
  ) {}

  async create(dto: any) {
    const user = await this.prisma[this.model].create({
      data: dto,
    });
    return user;
  }

  async findAll() {
    return this.prisma[this.model].findMany();
  }

  async findOne(id: number) {
    return this.prisma[this.model].findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, dto: any) {
    return this.prisma[this.model].update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma[this.model].delete({
      where: {
        id,
      },
    });
  }
}
