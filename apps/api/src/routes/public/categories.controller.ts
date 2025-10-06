import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('public:categories')
@Controller('api/categories')
export class CategoriesPublicController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'List all categories with group counts and media' })
    @ApiOkResponse({ description: 'Array of categories' })
    async list() {
        const categories = await this.prisma.category.findMany({
            orderBy: { name: 'asc' },
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
                _count: {
                    select: { groups: true },
                },
                media: {
                    select: {
                        id: true,
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

        const base = process.env.PUBLIC_CDN_BASE!;

        return categories.map(c => ({
            id: c.id,
            name: c.name,
            color: c.color,
            description: c.description,
            properties: c.properties,
            applications: c.applications,
            formatsSpecifications: c.formatsSpecifications,
            keyFigures: c.keyFigures,
            ordering: c.ordering,
            orderingNotes: c.orderingNotes,
            groupCount: c._count.groups,
            media: c.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
        }));
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get a single category by ID' })
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

        const base = process.env.PUBLIC_CDN_BASE!;

        return {
            ...category,
            groups: category.groups.map(g => g.group),
            media: category.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
        };
    }

    @Get('by-name/:name')
    @ApiOperation({ summary: 'Get a single category by name' })
    async getByName(@Param('name') name: string) {
        const category = await this.prisma.category.findFirst({
            where: { 
                name: {
                    equals: name,
                    mode: 'insensitive',
                }
            },
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

        const base = process.env.PUBLIC_CDN_BASE!;

        return {
            ...category,
            groups: category.groups.map(g => g.group),
            media: category.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
        };
    }
}
