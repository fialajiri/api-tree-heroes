import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsInt } from 'class-validator';

@InputType()
export class CreateHeroInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  age: number;
}
