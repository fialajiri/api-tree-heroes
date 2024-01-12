import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User as UserDb } from '@prisma/client';

@ObjectType()
export class UserResponse {
  @Field(() => Int, { description: 'Each Superhero must have an id' })
  id: UserDb['id'];

  @Field(() => String)
  email: UserDb['email'];
}
