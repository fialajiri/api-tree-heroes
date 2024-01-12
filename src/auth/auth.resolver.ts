import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-input';
import { PrismaService } from './../prisma/prisma.service';
import * as bcryptjs from 'bcryptjs';
import { ResGql } from './../shared/decorators';
import { Response } from 'express';
import { User } from './../user/entities/user.entity';
import { UserResponse } from './../user/entities/user-response.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @Mutation(() => UserResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @ResGql() res: Response,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });

    if (!user) {
      throw Error('No user found for provided email. Try SignUp instead');
    }

    const isPasswordValid = await bcryptjs.compare(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw Error('Invalid passport');
    }

    const jwt = this.jwt.sign({ id: user.id });
    res.cookie('token', jwt, { httpOnly: true });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    const userWithoutPassword: UserResponse = { ...rest };

    return userWithoutPassword;
  }

  @Mutation(() => UserResponse)
  async signup(
    @Args('signUpInput') signUpInput: SignUpInput,
    @ResGql() res: Response,
  ) {
    const emailAlreadyInDb = await this.prisma.user.findUnique({
      where: { email: signUpInput.email },
    });

    if (emailAlreadyInDb) {
      throw Error('Email is already in use');
    }
    const hashedPassword = await bcryptjs.hash(signUpInput.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...signUpInput,
        password: hashedPassword,
      },
    });

    const jwt = this.jwt.sign({ id: user.id });
    res.cookie('token', jwt, { httpOnly: true });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    const userWithoutPassword: UserResponse = { ...rest };

    return userWithoutPassword;
  }
}
