import { CreateHeroInput } from './create-hero.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateHeroInput extends PartialType(CreateHeroInput) {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => Int)
  @IsInt()
  age: number;
}
