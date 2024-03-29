import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

const cookieExtractor = (req: Request): string | null => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies.token;
    return token;
  }

  // This only for testing. During testing I could not get the cookie from req.cookies
  if (req && req.headers && req.headers.cookie) {
    const cookie = req.headers.cookie.split(';')[0].split('=')[1];
    token = cookie;
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload) {
    return this.authService.validate(payload);
  }
}
