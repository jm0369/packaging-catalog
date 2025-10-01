// packages/db/prisma/seed.cjs
/* Seed minimal catalog data */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1) Article groups
  const grpBoxes = await prisma.articleGroupMirror.upsert({
    where: { externalId: 'grp-boxes' },
    update: { name: 'Boxes', description: 'Corrugated and shipping boxes' },
    create: {
      externalId: 'grp-boxes',
      name: 'Boxes',
      description: 'Corrugated and shipping boxes',
      updatedAt: new Date(),
      sortOrder: 1,
      active: true
    }
  });

  const grpTapes = await prisma.articleGroupMirror.upsert({
    where: { externalId: 'grp-tapes' },
    update: { name: 'Tapes', description: 'Packaging tapes' },
    create: {
      externalId: 'grp-tapes',
      name: 'Tapes',
      description: 'Packaging tapes',
      updatedAt: new Date(),
      sortOrder: 2,
      active: true
    }
  });

  // 2) A couple of articles
  await prisma.articleMirror.upsert({
    where: { externalId: 'art-box-001' },
    update: { title: 'Standard Shipping Box 300x200x150', description: 'Single wall, brown' },
    create: {
      externalId: 'art-box-001',
      articleGroupId: grpBoxes.id,
      sku: 'BOX-300-200-150',
      ean: null,
      title: 'Standard Shipping Box 300x200x150',
      description: 'Single wall, brown',
      attributes: { wall: 'single', color: 'brown', dims_mm: [300, 200, 150] },
      uom: 'pcs',
      active: true,
      updatedAt: new Date()
    }
  });

  await prisma.articleMirror.upsert({
    where: { externalId: 'art-tape-001' },
    update: { title: 'PP Packing Tape 48mm x 66m transparent' },
    create: {
      externalId: 'art-tape-001',
      articleGroupId: grpTapes.id,
      sku: 'TAPE-48-66-PP-TR',
      ean: null,
      title: 'PP Packing Tape 48mm x 66m transparent',
      description: 'Solvent adhesive',
      attributes: { material: 'PP', width_mm: 48, length_m: 66, color: 'transparent' },
      uom: 'roll',
      active: true,
      updatedAt: new Date()
    }
  });

  // 3) (Optional) one demo media asset for Boxes group
  const media = await prisma.mediaAsset.upsert({
    where: { key: 'article-groups/boxes-demo.jpg' },
    update: {},
    create: {
      key: 'article-groups/boxes-demo.jpg',
      mime: 'image/jpeg',
      width: 1280,
      height: 720,
      sizeBytes: 123456,
      checksum: 'demo'
    }
  });

  await prisma.articleGroupMediaLink.upsert({
    where: { groupId_mediaId: { groupId: grpBoxes.id, mediaId: media.id } },
    update: {},
    create: { groupId: grpBoxes.id, mediaId: media.id, altText: 'Boxes', sortOrder: 0 }
  });

  console.log('✅ Seed completed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});