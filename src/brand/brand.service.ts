import { Injectable } from '@nestjs/common';
import { BaseResourceService } from 'src/common/base-resources/base-resource.service';
import { PrismaModel } from 'src/common/enums/prisma-model.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, PrismaModel.BRAND);
  }
}
