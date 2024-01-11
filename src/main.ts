import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: false,
  // signed: true,
  // maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY!) * 1000,
  sameSite: 'none' as const,
};

export const CORS_OPTIONS = {
  origin: true,
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(cookieParser(COOKIE_OPTIONS));

  await app.listen(3000);
}
bootstrap();
