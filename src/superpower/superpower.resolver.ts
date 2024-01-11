import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SuperpowerService } from './superpower.service';
import { Superpower } from './entities/superpower.entity';
import { CreateSuperpowerInput } from './dto/create-superpower.input';
import { UpdateSuperpowerInput } from './dto/update-superpower.input';
import { GetSuperpowerArgs } from './dto/get-superpower.args';
import { GetSuperpowersArgs } from './dto/get-superpowers.args';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './../../src/auth/graph-ql-auth-guard';

@Resolver(() => Superpower)
export class SuperpowerResolver {
  constructor(private readonly superpowerService: SuperpowerService) {}

  @Mutation(() => Superpower)
  @UseGuards(GqlAuthGuard)
  createSuperpower(
    @Args('createSuperpowerInput') createSuperpowerInput: CreateSuperpowerInput,
  ) {
    return this.superpowerService.create(createSuperpowerInput);
  }

  @Query(() => [Superpower], { name: 'superpowers' })
  @UseGuards(GqlAuthGuard)
  findAll(@Args() getSuperpowersArgs: GetSuperpowersArgs) {
    return this.superpowerService.findAll(getSuperpowersArgs);
  }

  @Query(() => Superpower, { name: 'superpower' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args() getSuperpowerArgs: GetSuperpowerArgs) {
    return this.superpowerService.findOne(getSuperpowerArgs);
  }

  @Mutation(() => Superpower)
  @UseGuards(GqlAuthGuard)
  updateSuperpower(
    @Args('updateSuperpowerInput') updateSuperpowerInput: UpdateSuperpowerInput,
  ) {
    return this.superpowerService.update(
      updateSuperpowerInput.id,
      updateSuperpowerInput,
    );
  }

  @Mutation(() => Superpower)
  @UseGuards(GqlAuthGuard)
  removeSuperpower(@Args('id', { type: () => Int }) id: number) {
    return this.superpowerService.remove(id);
  }
}
