import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(6)
  password: string;
}
