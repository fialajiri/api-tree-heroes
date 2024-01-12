import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VillanService } from './villan.service';
import { Villan } from './entities/villan.entity';
import { CreateVillanInput } from './dto/create-villan.input';
import { UpdateVillanInput } from './dto/update-villan.input';
import { GetVillanArgs } from './dto/get-villan.args';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './../auth/graph-ql-auth-guard';

@Resolver(() => Villan)
export class VillanResolver {
  constructor(private readonly villanService: VillanService) {}

  @Mutation(() => Villan)
  @UseGuards(GqlAuthGuard)
  createVillan(
    @Args('createVillanInput') createVillanInput: CreateVillanInput,
  ) {
    return this.villanService.create(createVillanInput);
  }

  @Query(() => [Villan], { name: 'villans' })
  @UseGuards(GqlAuthGuard)
  findAll() {
    return this.villanService.findAll();
  }

  @Query(() => Villan, { name: 'villan' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args() getVillanArgs: GetVillanArgs) {
    return this.villanService.findOne(getVillanArgs);
  }

  @Mutation(() => Villan)
  @UseGuards(GqlAuthGuard)
  updateVillan(
    @Args('updateVillanInput') updateVillanInput: UpdateVillanInput,
  ) {
    return this.villanService.update(updateVillanInput.id, updateVillanInput);
  }

  @Mutation(() => Villan)
  @UseGuards(GqlAuthGuard)
  removeVillan(@Args('id', { type: () => Int }) id: number) {
    return this.villanService.remove(id);
  }
}
