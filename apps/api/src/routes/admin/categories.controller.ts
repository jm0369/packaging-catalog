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
        description: true,
        properties: true,
        applications: true,
        formatsSpecifications: true,
        keyFigures: true,
        ordering: true,
        orderingNotes: true,
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
        media: {
          select: {
            id: true,
            mediaId: true,
            altText: true,
            sortOrder: true,
            media: {
              select: {
                id: true,
                key: true,
                mime: true,
                width: true,
                height: true,
                variants: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!category) return { statusCode: 404, message: 'Category not found' };
    
    return {
      ...category,
      groups: category.groups.map(g => g.group),
      media: category.media.map(m => ({
        ...m.media,
        altText: m.altText,
        sortOrder: m.sortOrder,
      })),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a category. Body: { name, color, description?, properties?, applications?, formatsSpecifications?, keyFigures?, ordering?, orderingNotes? }' })
  async create(@Body() body: {
    name: string;
    color: string;
    description?: string;
    properties?: Array<{ name: string; description: string }>;
    applications?: string[];
    formatsSpecifications?: string[];
    keyFigures?: Array<{ name: string; description: string }>;
    ordering?: Array<{ name: string; description: string }>;
    orderingNotes?: string[];
  }) {
    return this.prisma.category.create({
      data: {
        name: body.name,
        color: body.color,
        description: body.description,
        properties: body.properties as any,
        applications: body.applications as any,
        formatsSpecifications: body.formatsSpecifications as any,
        keyFigures: body.keyFigures as any,
        ordering: body.ordering as any,
        orderingNotes: body.orderingNotes as any,
      },
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category. All fields optional: { name?, color?, description?, properties?, applications?, formatsSpecifications?, keyFigures?, ordering?, orderingNotes? }' })
  async update(@Param('id') id: string, @Body() body: {
    name?: string;
    color?: string;
    description?: string;
    properties?: Array<{ name: string; description: string }>;
    applications?: string[];
    formatsSpecifications?: string[];
    keyFigures?: Array<{ name: string; description: string }>;
    ordering?: Array<{ name: string; description: string }>;
    orderingNotes?: string[];
  }) {
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.color !== undefined) data.color = body.color;
    if (body.description !== undefined) data.description = body.description;
    if (body.properties !== undefined) data.properties = body.properties;
    if (body.applications !== undefined) data.applications = body.applications;
    if (body.formatsSpecifications !== undefined) data.formatsSpecifications = body.formatsSpecifications;
    if (body.keyFigures !== undefined) data.keyFigures = body.keyFigures;
    if (body.ordering !== undefined) data.ordering = body.ordering;
    if (body.orderingNotes !== undefined) data.orderingNotes = body.orderingNotes;

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
