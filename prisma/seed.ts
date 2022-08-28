import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const user = await db.user.create({
    data: {
      username: "admin",
      email: "admin@mail.com",
      passwordHash: "$2a$10$81NY9dWiXPJn/S0uPnGOqe.QhXWP8CPBGIs.B1XqFcRhi2Qo6dtKu",
    },
  });
  await Promise.all(
    getProjects().map((project) => {
      const data = { createdBy: user.id, ...project };
      return db.project.create({ data });
    })
  );
}

seed();

function getProjects() {
  return [
    {
      name: "Thewantara",
      description: "💻 Blogging content for programmers"
    }
  ];
}