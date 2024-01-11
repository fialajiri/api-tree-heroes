import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetSuperpowersArgs {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  heroId: number;
}
