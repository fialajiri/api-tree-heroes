import { Injectable } from '@nestjs/common';
import { CreateSuperpowerInput } from './dto/create-superpower.input';
import { UpdateSuperpowerInput } from './dto/update-superpower.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Superpower } from '@prisma/client';
import { GetSuperpowerArgs } from './dto/get-superpower.args';
import { GetSuperpowersArgs } from './dto/get-superpowers.args';

@Injectable()
export class SuperpowerService {
  constructor(private prisma: PrismaService) {}
  create(createSuperpowerInput: CreateSuperpowerInput): Promise<Superpower> {
    return this.prisma.superpower.create({
      data: {
        ...createSuperpowerInput,
      },
    });
  }

  findAll(getSuperpowersArgs: GetSuperpowersArgs): Promise<Superpower[]> {
    return this.prisma.superpower.findMany({
      where: { heroId: getSuperpowersArgs.heroId },
    });
  }

  findOne(getSuperpowerArgs: GetSuperpowerArgs): Promise<Superpower | null> {
    return this.prisma.superpower.findUnique({
      where: { id: getSuperpowerArgs.id },
    });
  }

  update(
    id: number,
    updateSuperpowerInput: UpdateSuperpowerInput,
  ): Promise<Superpower> {
    return this.prisma.superpower.update({
      where: { id },
      data: { ...updateSuperpowerInput },
    });
  }

  remove(id: number): Promise<Superpower> {
    return this.prisma.superpower.delete({ where: { id } });
  }
}
