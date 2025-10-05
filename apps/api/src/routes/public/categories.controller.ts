import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('public:categories')
@Controller('api/categories')
export class CategoriesPublicController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories with group counts' })
  @ApiOkResponse({ description: 'Array of categories' })
  async list() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: { groups: true },
        },
      },
    });

    return categories.map(c => ({
      id: c.id,
      name: c.name,
      color: c.color,
      groupCount: c._count.groups,
    }));
  }
}
