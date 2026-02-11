import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResourceService } from 'src/common/base-resources/base-resource.service';
import { PrismaModel } from 'src/common/enums/prisma-model.enum';

@Injectable()
export class UserService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, PrismaModel.USER);
  }
}
