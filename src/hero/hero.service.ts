import { Injectable } from '@nestjs/common';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';
import { PrismaService } from './../prisma/prisma.service';
import { Hero } from '@prisma/client';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}
  create(createHeroInput: CreateHeroInput): Promise<Hero> {
    return this.prisma.hero.create({
      data: {
        ...createHeroInput,
      },
    });
  }

  findAll(): Promise<Hero[]> {
    return this.prisma.hero.findMany();
  }

  findOne(id: number): Promise<Hero | null> {
    return this.prisma.hero.findUnique({ where: { id } });
  }

  update(id: number, updateHeroInput: UpdateHeroInput): Promise<Hero> {
    return this.prisma.hero.update({
      where: { id },
      data: { ...updateHeroInput },
    });
  }

  remove(id: number): Promise<Hero> {
    return this.prisma.hero.delete({ where: { id } });
  }
}
