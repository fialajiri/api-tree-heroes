import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Villan as VillanDb } from '@prisma/client';

@ObjectType()
export class Villan {
  @Field(() => Int, { description: 'Even a villan must have a unique id' })
  id: VillanDb['id'];

  @Field(() => String)
  name: VillanDb['name'];

  @Field(() => Int)
  heroId: VillanDb['heroId'];
}
