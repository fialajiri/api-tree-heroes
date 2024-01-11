import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async clearUsersFromDb() {
    await this.user.deleteMany();
  }

  async clearHeroesFromDb() {
    await this.villan.deleteMany();
    await this.superpower.deleteMany();
    await this.hero.deleteMany();
  }

  async close() {
    await this.$disconnect();
  }
}
