import { Module } from '@nestjs/common';
import { VillanService } from './villan.service';
import { VillanResolver } from './villan.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [VillanResolver, VillanService, PrismaService],
})
export class VillanModule {}
