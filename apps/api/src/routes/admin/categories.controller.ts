import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:categories')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a single category' })
  async getById(@Param('id') id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        color: true,
        groups: {
          select: {
            group: {
              select: {
                id: true,
                externalId: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!category) return { statusCode: 404, message: 'Category not found' };
    
    return {
      ...category,
      groups: category.groups.map(g => g.group),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a category. Body: { name, color }' })
  async create(@Body() body: { name: string; color: string }) {
    return this.prisma.category.create({
      data: {
        name: body.name,
        color: body.color,
      },
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category. Body: { name?, color? }' })
  async update(@Param('id') id: string, @Body() body: { name?: string; color?: string }) {
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.color !== undefined) data.color = body.color;

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  async delete(@Param('id') id: string) {
    await this.prisma.category.delete({
      where: { id },
    });
    return { ok: true };
  }
}
