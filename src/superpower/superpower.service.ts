import { Injectable } from '@nestjs/common';
import { CreateSuperpowerInput } from './dto/create-superpower.input';
import { UpdateSuperpowerInput } from './dto/update-superpower.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Superpower } from '@prisma/client';

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

  findAll(): Promise<Superpower[]> {
    return this.prisma.superpower.findMany();
  }

  findOne(id: number): Promise<Superpower | null> {
    return this.prisma.superpower.findUnique({ where: { id } });
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
