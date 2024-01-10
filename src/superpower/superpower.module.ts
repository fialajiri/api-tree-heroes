import { Module } from '@nestjs/common';
import { SuperpowerService } from './superpower.service';
import { SuperpowerResolver } from './superpower.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SuperpowerResolver, SuperpowerService, PrismaService],
})
export class SuperpowerModule {}
