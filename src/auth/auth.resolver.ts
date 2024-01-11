import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcryptjs from 'bcryptjs';
import { ResGql } from 'src/shared/decorators';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @Mutation(() => User)
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

    return user;
  }

  @Mutation(() => User)
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
    const password = await bcryptjs.hash(signUpInput.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...signUpInput,
        password,
      },
    });

    const jwt = this.jwt.sign({ id: user.id });
    res.cookie('token', jwt, { httpOnly: true });

    return user;
  }
}
