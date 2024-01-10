import { CreateVillanInput } from './create-villan.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateVillanInput extends PartialType(CreateVillanInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;
}
