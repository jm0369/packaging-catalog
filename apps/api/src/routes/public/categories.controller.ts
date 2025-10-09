import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { slugifyCategory } from '../../utils/slugify';

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
                type: true,
                color: true,
                description: true,
                properties: true,
                applications: true,
                formatsSpecifications: true,
                keyFigures: true,
                ordering: true,
                orderingNotes: true,
                _count: {
                    select: { 
                        groups: true,
                        articles: true,
                    },
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
            type: c.type,
            color: c.color,
            description: c.description,
            properties: c.properties,
            applications: c.applications,
            formatsSpecifications: c.formatsSpecifications,
            keyFigures: c.keyFigures,
            ordering: c.ordering,
            orderingNotes: c.orderingNotes,
            groupCount: c._count.groups,
            articleCount: c._count.articles,
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
                type: true,
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
                articles: {
                    select: {
                        article: {
                            select: {
                                id: true,
                                externalId: true,
                                title: true,
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
            articles: category.articles.map(a => a.article),
            media: category.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
        };
    }

    @Get('by-name/:name')
    @ApiOperation({ summary: 'Get a single category by name or slug' })
    async getByName(@Param('name') name: string) {
        // First, try to find all categories and match by slug
        const allCategories = await this.prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        // Find the category whose slugified name matches the input slug
        const matchedCategory = allCategories.find(c => slugifyCategory(c.name) === name.toLowerCase());

        if (!matchedCategory) {
            // Fallback: try exact name match (case-insensitive)
            const categoryByName = await this.prisma.category.findFirst({
                where: { 
                    name: {
                        equals: name,
                        mode: 'insensitive',
                    }
                },
                select: { id: true },
            });

            if (!categoryByName) {
                return { statusCode: 404, message: 'Category not found' };
            }
        }

        // Now fetch the full category details
        const categoryId = matchedCategory?.id || (await this.prisma.category.findFirst({
            where: { 
                name: {
                    equals: name,
                    mode: 'insensitive',
                }
            },
            select: { id: true },
        }))?.id;

        if (!categoryId) {
            return { statusCode: 404, message: 'Category not found' };
        }

        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            select: {
                id: true,
                name: true,
                type: true,
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
                articles: {
                    select: {
                        article: {
                            select: {
                                id: true,
                                externalId: true,
                                title: true,
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
            articles: category.articles.map(a => a.article),
            media: category.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
        };
    }
}
