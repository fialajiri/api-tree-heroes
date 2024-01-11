import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SuperpowerService } from './superpower.service';
import { Superpower } from './entities/superpower.entity';
import { CreateSuperpowerInput } from './dto/create-superpower.input';
import { UpdateSuperpowerInput } from './dto/update-superpower.input';
import { GetSuperpowerArgs } from './dto/get-superpower.args';
import { GetSuperpowersArgs } from './dto/get-superpowers.args';

@Resolver(() => Superpower)
export class SuperpowerResolver {
  constructor(private readonly superpowerService: SuperpowerService) {}

  @Mutation(() => Superpower)
  createSuperpower(
    @Args('createSuperpowerInput') createSuperpowerInput: CreateSuperpowerInput,
  ) {
    return this.superpowerService.create(createSuperpowerInput);
  }

  @Query(() => [Superpower], { name: 'superpowers' })
  findAll(@Args() getSuperpowersArgs: GetSuperpowersArgs) {
    return this.superpowerService.findAll(getSuperpowersArgs);
  }

  @Query(() => Superpower, { name: 'superpower' })
  findOne(@Args() getSuperpowerArgs: GetSuperpowerArgs) {
    return this.superpowerService.findOne(getSuperpowerArgs);
  }

  @Mutation(() => Superpower)
  updateSuperpower(
    @Args('updateSuperpowerInput') updateSuperpowerInput: UpdateSuperpowerInput,
  ) {
    return this.superpowerService.update(
      updateSuperpowerInput.id,
      updateSuperpowerInput,
    );
  }

  @Mutation(() => Superpower)
  removeSuperpower(@Args('id', { type: () => Int }) id: number) {
    return this.superpowerService.remove(id);
  }
}
