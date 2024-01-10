import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Superpower as SuperpowerDb } from '@prisma/client';

@ObjectType()
export class Superpower {
  @Field(() => Int)
  id: SuperpowerDb['id'];

  @Field(() => String)
  name: SuperpowerDb['name'];

  @Field(() => Int)
  heroId: SuperpowerDb['heroId'];
}
