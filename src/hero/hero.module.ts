import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroResolver } from './hero.resolver';
import { PrismaService } from './../prisma/prisma.service';
import { SuperpowerService } from './../superpower/superpower.service';
import { VillanService } from './../villan/villan.service';

@Module({
  providers: [
    HeroResolver,
    HeroService,
    PrismaService,
    SuperpowerService,
    VillanService,
  ],
})
export class HeroModule {}
