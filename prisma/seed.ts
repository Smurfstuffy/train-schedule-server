import { PrismaClient } from '@prisma/client';
import { TrainType } from '../src/schedules/enums/train-type.enum';

const prisma = new PrismaClient();

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
