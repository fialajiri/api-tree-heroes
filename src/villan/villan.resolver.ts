import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VillanService } from './villan.service';
import { Villan } from './entities/villan.entity';
import { CreateVillanInput } from './dto/create-villan.input';
import { UpdateVillanInput } from './dto/update-villan.input';
import { GetVillanArgs } from './dto/get-villan.args';

@Resolver(() => Villan)
export class VillanResolver {
  constructor(private readonly villanService: VillanService) {}

  @Mutation(() => Villan)
  createVillan(
    @Args('createVillanInput') createVillanInput: CreateVillanInput,
  ) {
    return this.villanService.create(createVillanInput);
  }

  @Query(() => [Villan], { name: 'villans' })
  findAll() {
    return this.villanService.findAll();
  }

  @Query(() => Villan, { name: 'villan' })
  findOne(@Args() getVillanArgs: GetVillanArgs) {
    return this.villanService.findOne(getVillanArgs);
  }

  @Mutation(() => Villan)
  updateVillan(
    @Args('updateVillanInput') updateVillanInput: UpdateVillanInput,
  ) {
    return this.villanService.update(updateVillanInput.id, updateVillanInput);
  }

  @Mutation(() => Villan)
  removeVillan(@Args('id', { type: () => Int }) id: number) {
    return this.villanService.remove(id);
  }
}
