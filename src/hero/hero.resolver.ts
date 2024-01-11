import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { HeroService } from './hero.service';
import { Hero } from './entities/hero.entity';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';
import { SuperpowerService } from 'src/superpower/superpower.service';
import { VillanService } from 'src/villan/villan.service';
import { Superpower } from 'src/superpower/entities/superpower.entity';
import { Villan } from 'src/villan/entities/villan.entity';
import { GqlAuthGuard } from 'src/auth/graph-ql-auth-guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Hero)
export class HeroResolver {
  constructor(
    private readonly heroService: HeroService,
    private readonly superpowerService: SuperpowerService,
    private readonly villanService: VillanService,
  ) {}

  @Mutation(() => Hero)
  createHero(@Args('createHeroInput') createHeroInput: CreateHeroInput) {
    return this.heroService.create(createHeroInput);
  }

  @Query(() => [Hero], { name: 'heroes' })
  findAll() {
    return this.heroService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Hero, { name: 'hero' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.heroService.findOne(id);
  }

  @Mutation(() => Hero)
  updateHero(@Args('updateHeroInput') updateHeroInput: UpdateHeroInput) {
    return this.heroService.update(updateHeroInput.id, updateHeroInput);
  }

  @Mutation(() => Hero)
  removeHero(@Args('id', { type: () => Int }) id: number) {
    return this.heroService.remove(id);
  }

  @ResolveField('superpowers', () => [Superpower])
  getSuperpowersByHeroId(@Parent() hero: Hero): Promise<Superpower[]> {
    return this.superpowerService.findAll({
      heroId: hero.id,
    });
  }

  @ResolveField('archEnemy', () => Villan, { nullable: true })
  getVillanByHeroId(@Parent() hero: Hero): Promise<Villan> {
    return this.villanService.findOne({ heroId: hero.id });
  }
}
