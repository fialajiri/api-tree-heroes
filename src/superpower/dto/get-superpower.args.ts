import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetSuperpowerArgs {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}
