import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SuperpowerService } from './superpower.service';
import { Superpower } from './entities/superpower.entity';
import { CreateSuperpowerInput } from './dto/create-superpower.input';
import { UpdateSuperpowerInput } from './dto/update-superpower.input';

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
  findAll() {
    return this.superpowerService.findAll();
  }

  @Query(() => Superpower, { name: 'superpower' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.superpowerService.findOne(id);
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
