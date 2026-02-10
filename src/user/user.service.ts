import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResourceService } from 'src/common/base-resources/base-resource.service';

@Injectable()
export class UserService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }
}
