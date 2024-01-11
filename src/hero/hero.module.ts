import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroResolver } from './hero.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { SuperpowerService } from 'src/superpower/superpower.service';
import { VillanService } from 'src/villan/villan.service';

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
