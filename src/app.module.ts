import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HeroModule } from './hero/hero.module';
import { PrismaService } from './prisma/prisma.service';
import { SuperpowerService } from './superpower/superpower.service';
import { SuperpowerModule } from './superpower/superpower.module';
import { VillanModule } from './villan/villan.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    HeroModule,
    SuperpowerModule,
    VillanModule,
  ],
  providers: [PrismaService, SuperpowerService],
})
export class AppModule {}
