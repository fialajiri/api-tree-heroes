import { CreateSuperpowerInput } from './create-superpower.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateSuperpowerInput extends PartialType(CreateSuperpowerInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;
}
