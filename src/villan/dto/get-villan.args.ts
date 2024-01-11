import { ArgsType, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetVillanArgs {
  @Field(() => String)
  @IsNotEmpty()
  @IsInt()
  heroId: number;
}
