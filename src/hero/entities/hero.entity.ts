import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Hero as HeroDb } from '@prisma/client';

@ObjectType()
export class Hero {
  @Field(() => Int, { description: 'Each Superhero must have an id' })
  id: HeroDb['id'];

  @Field(() => String)
  name: HeroDb['name'];

  @Field(() => Int)
  age: HeroDb['age'];
}
