// apps/api/src/admin/admin.service.ts (add method)
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
