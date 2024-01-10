import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateVillanInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  heroId: number;
}
