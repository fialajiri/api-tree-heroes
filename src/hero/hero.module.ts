import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroResolver } from './hero.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [HeroResolver, HeroService, PrismaService],
})
export class HeroModule {}
