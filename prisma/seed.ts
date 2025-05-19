import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      address: "Rua Teste, 123",
      emailVerified: null,
      password: undefined,
    },
  });

  // Create some cupcakes
  const cupcakes = await Promise.all([
    prisma.cupcake.create({
      data: {
        name: "Chocolate Delight",
        description: "Delicioso cupcake de chocolate com cobertura de ganache",
        price: 12.9,
        image:
          "https://s2-casavogue.glbimg.com/mNrNrx8_XLOvXoQPEqaYTWvZYuY=/0x0:2953x1969/600x0/smart/filters:gifv():strip_icc()/i.s3.glbimg.com/v1/AUTH_d72fd4bf0af74c0c89d27a5a226dbbf8/internal_photos/bs/2022/K/A/gEAHBlTbe2PpCTIcucuw/cupcake-de-ganache-foto-divulgacao.jpg",
        featured: true,
        new: false,
        rating: 4.8,
      },
    }),
    prisma.cupcake.create({
      data: {
        name: "Morango Fresco",
        description: "Cupcake de baunilha com recheio e cobertura de morango",
        price: 13.9,
        image:
          "https://s2-g1.glbimg.com/wsJ8upH9cOGqf2hDpjpFxnpoN9w=/0x0:1182x816/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/4/b/YZBBd0TGGBAcFb4lSpqA/img-20190804-wa0001.jpg",
        featured: false,
        new: true,
        rating: 4.5,
      },
    }),
    prisma.cupcake.create({
      data: {
        name: "Caramelo Salgado",
        description: "Cupcake de caramelo com toque de sal marinho",
        price: 14.9,
        image:
          "https://horneandolasnubes.com/wp-content/uploads/2024/06/cupcakes_caramelo_500x625-500x500.png",
        featured: true,
        new: false,
        rating: 4.9,
      },
    }),
  ]);

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PENDING",
      total: 26.8,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      paymentMethod: "CREDIT",
      items: {
        create: [
          {
            cupcakeId: cupcakes[0].id,
            quantity: 1,
            price: cupcakes[0].price,
          },
          {
            cupcakeId: cupcakes[1].id,
            quantity: 1,
            price: cupcakes[1].price,
          },
        ],
      },
    },
  });

  // Add some favorites
  await Promise.all([
    prisma.favorite.create({
      data: {
        userId: user.id,
        cupcakeId: cupcakes[0].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: user.id,
        cupcakeId: cupcakes[2].id,
      },
    }),
  ]);

  console.log({ user, cupcakes, order });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
