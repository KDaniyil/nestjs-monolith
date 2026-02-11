import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResourceService } from 'src/common/base-resources/base-resource.service';
import { PrismaModel } from 'src/common/enums/prisma-model.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, PrismaModel.USER);
  }

  async create(dto: CreateUserDto) {
    const { email, password } = dto;
    const existingUser = await this.findByEmail(email);
    if (existingUser) throw new BadRequestException('User already exists');
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    return await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
