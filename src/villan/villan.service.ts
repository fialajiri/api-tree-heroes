import { Injectable } from '@nestjs/common';
import { CreateVillanInput } from './dto/create-villan.input';
import { UpdateVillanInput } from './dto/update-villan.input';
import { PrismaService } from './../prisma/prisma.service';
import { Villan } from '@prisma/client';
import { GetVillanArgs } from './dto/get-villan.args';

@Injectable()
export class VillanService {
  constructor(private prisma: PrismaService) {}
  create(createVillanInput: CreateVillanInput): Promise<Villan> {
    return this.prisma.villan.create({
      data: {
        ...createVillanInput,
      },
    });
  }

  findAll(): Promise<Villan[]> {
    return this.prisma.villan.findMany();
  }

  findOne(getVillanArgs: GetVillanArgs): Promise<Villan | null> {
    return this.prisma.villan.findUnique({
      where: { heroId: getVillanArgs.heroId },
    });
  }

  update(id: number, updateVillanInput: UpdateVillanInput): Promise<Villan> {
    return this.prisma.villan.update({
      where: { id },
      data: { ...updateVillanInput },
    });
  }

  remove(id: number): Promise<Villan> {
    return this.prisma.villan.delete({ where: { id } });
  }
}
