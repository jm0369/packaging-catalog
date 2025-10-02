// apps/api/src/admin/admin.service.ts (add method)
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { cdnUrlForKey } from 'src/utils/cdn';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ...existing methods

  async reorderGroupMedia(externalId: string, order: string[]) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!group) throw new NotFoundException('Group not found');

    const links = await this.prisma.articleGroupMediaLink.findMany({
      where: { groupId: group.id },
      select: { id: true },
    });
    const linkIds = new Set(links.map((l) => l.id));

    // Validate: all provided ids belong to this group
    for (const id of order) {
      if (!linkIds.has(id)) {
        throw new BadRequestException(`Link ${id} does not belong to group`);
      }
    }

    // Apply order; any links not provided get appended after, preserving their relative order
    const missing = links.map((l) => l.id).filter((id) => !order.includes(id));
    const finalOrder = [...order, ...missing];

    await this.prisma.$transaction(
      finalOrder.map((id, idx) =>
        this.prisma.articleGroupMediaLink.update({
          where: { id },
          data: { sortOrder: idx },
        }),
      ),
    );

    // Return updated list with media + isPrimary flag (sortOrder=0)
    const updated = await this.prisma.articleGroupMediaLink.findMany({
      where: { groupId: group.id },
      orderBy: { sortOrder: 'asc' },
      include: { media: true },
    });

    return {
      group: { id: group.id, externalId },
      media: updated.map((m) => ({
        id: m.id,
        mediaId: m.mediaId,
        altText: m.altText,
        sortOrder: m.sortOrder,
        isPrimary: m.sortOrder === 0,
        media: m.media,
      })),
    };
  }

  // ------- Article media -------
  async listArticleMedia(externalId: string) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true, externalId: true, title: true },
    });
    if (!article) throw new NotFoundException('Article not found');

    const links = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      include: { media: true },
      orderBy: { sortOrder: 'asc' },
    });

    return {
      article: {
        id: article.id,
        externalId: article.externalId,
        title: article.title,
      },
      media: links.map((l) => ({
        id: l.id,
        mediaId: l.mediaId,
        altText: l.altText,
        sortOrder: l.sortOrder,
        isPrimary: l.sortOrder === 0,
        media: l.media,
        url: cdnUrlForKey(l.media?.key),
      })),
    };
  }

  async linkArticleMedia(
    externalId: string,
    mediaId: string,
    altText?: string,
  ) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new NotFoundException('Article not found');

    const max = await this.prisma.articleMediaLink.aggregate({
      where: { articleId: article.id },
      _max: { sortOrder: true },
    });
    const nextSort = (max._max.sortOrder ?? -1) + 1;

    const link = await this.prisma.articleMediaLink.create({
      data: { articleId: article.id, mediaId, altText, sortOrder: nextSort },
      include: { media: true },
    });

    return { id: link.id, sortOrder: link.sortOrder, mediaId: link.mediaId };
  }

  async setArticlePrimary(externalId: string, linkId: string) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new NotFoundException('Article not found');

    const link = await this.prisma.articleMediaLink.findUnique({
      where: { id: linkId },
    });
    if (!link || link.articleId !== article.id) {
      throw new BadRequestException('Link does not belong to this article');
    }

    const links = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      orderBy: { sortOrder: 'asc' },
      select: { id: true },
    });
    const ids = links.map((l) => l.id);
    const idx = ids.indexOf(linkId);
    if (idx === -1) throw new NotFoundException('Link not found');

    // move chosen link to front (sortOrder=0)
    const reordered = [linkId, ...ids.filter((id) => id !== linkId)];
    await this.prisma.$transaction(
      reordered.map((id, i) =>
        this.prisma.articleMediaLink.update({
          where: { id },
          data: { sortOrder: i },
        }),
      ),
    );

    return { ok: true };
  }

  async reorderArticleMedia(externalId: string, order: string[]) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new NotFoundException('Article not found');

    const links = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      select: { id: true },
    });
    const valid = new Set(links.map((l) => l.id));
    for (const id of order)
      if (!valid.has(id)) {
        throw new BadRequestException(`Link ${id} does not belong to article`);
      }
    const missing = links.map((l) => l.id).filter((id) => !order.includes(id));
    const finalOrder = [...order, ...missing];

    await this.prisma.$transaction(
      finalOrder.map((id, i) =>
        this.prisma.articleMediaLink.update({
          where: { id },
          data: { sortOrder: i },
        }),
      ),
    );

    return { ok: true };
  }

  async unlinkArticleMedia(externalId: string, linkId: string) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new NotFoundException('Article not found');

    const link = await this.prisma.articleMediaLink.findUnique({
      where: { id: linkId },
    });
    if (!link || link.articleId !== article.id) {
      throw new BadRequestException('Link does not belong to this article');
    }

    await this.prisma.articleMediaLink.delete({ where: { id: linkId } });
    // Normalize sortOrder after deletion
    const rest = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      orderBy: { sortOrder: 'asc' },
      select: { id: true },
    });
    await this.prisma.$transaction(
      rest.map((r, i) =>
        this.prisma.articleMediaLink.update({
          where: { id: r.id },
          data: { sortOrder: i },
        }),
      ),
    );

    return { ok: true };
  }
}
