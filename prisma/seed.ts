import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { TrainType } from '../src/trains/enums/train-type.enum';
import { Role } from '../src/users/enums/role.enum';

const prisma = new PrismaClient();

const DEMO_CREDENTIALS = [
  { email: 'admin@example.com', password: 'admin123', role: Role.Admin },
  { email: 'user@example.com', password: 'user123', role: Role.User },
] as const;

const PREDEFINED_TRAINS: { trainTitle: string; trainType: TrainType }[] = [
  { trainTitle: 'Intercity 101', trainType: TrainType.Intercity },
  { trainTitle: 'Express 202', trainType: TrainType.Express },
  { trainTitle: 'Regional 45', trainType: TrainType.Regional },
  { trainTitle: 'High-Speed 1', trainType: TrainType.HighSpeed },
  { trainTitle: 'Commuter C-10', trainType: TrainType.Commuter },
  { trainTitle: 'Intercity 102', trainType: TrainType.Intercity },
  { trainTitle: 'Express 205', trainType: TrainType.Express },
  { trainTitle: 'Regional 48', trainType: TrainType.Regional },
  { trainTitle: 'Commuter C-12', trainType: TrainType.Commuter },
  { trainTitle: 'High-Speed 2', trainType: TrainType.HighSpeed },
];

async function main() {
  // Ensure roles exist
  for (const name of Object.values(Role)) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const roles = await prisma.role.findMany();
  const roleById = Object.fromEntries(roles.map(r => [r.name, r.id]));

  // Demo users for testing (idempotent: create or reset password)
  for (const { email, password, role } of DEMO_CREDENTIALS) {
    const passwordHash = await bcrypt.hash(password, 10);
    const roleId = roleById[role];
    if (!roleId) throw new Error(`Role not found: ${role}`);

    const existing = await prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (existing) {
      await prisma.auth.update({
        where: { userId: existing.id },
        data: { passwordHash },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          roleId,
          auth: { create: { passwordHash } },
        },
      });
    }
  }

  // Train types and trains
  const trainTypeNames = Object.values(TrainType);
  for (const name of trainTypeNames) {
    await prisma.trainType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const trainTypes = await prisma.trainType.findMany();
  const typeByName = Object.fromEntries(trainTypes.map(t => [t.name, t.id]));

  const trainData = PREDEFINED_TRAINS.map(({ trainTitle, trainType }) => {
    const trainTypeId = typeByName[trainType];
    if (!trainTypeId) throw new Error(`Unknown train type: ${trainType}`);
    return { trainTitle, trainTypeId };
  });

  await prisma.train.createMany({ data: trainData, skipDuplicates: true });
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
