import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:categories')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

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
