import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HeroModule } from './hero/hero.module';
import { PrismaService } from './prisma/prisma.service';
import { SuperpowerService } from './superpower/superpower.service';
import { SuperpowerModule } from './superpower/superpower.module';
import { VillanModule } from './villan/villan.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    HeroModule,
    SuperpowerModule,
    VillanModule,
    AuthModule,
    UserModule,
  ],
  providers: [PrismaService, SuperpowerService, AuthService],
})
export class AppModule {}
