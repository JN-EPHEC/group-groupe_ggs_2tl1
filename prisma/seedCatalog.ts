import { config } from "dotenv";
import { PrismaClient } from "../server/node_modules/.prisma/client/index.js";

config({ path: process.env.DOTENV_CONFIG_PATH || ".env" });

if (process.env.DATABASE_URL?.includes("supabase.com") && !process.env.DATABASE_URL.includes("sslmode=")) {
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("sslmode", "require");
  process.env.DATABASE_URL = url.toString();
}

const prisma = new PrismaClient({
  log: ["error"],
});

type CatalogProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

const products: CatalogProduct[] = [
  {
    category: "Nouveautes",
    name: "Blazer Milano noir",
    description: "Blazer structure en laine melangee, coupe droite et finition tailleur.",
    price: 129,
    stock: 18,
  },
  {
    category: "Nouveautes",
    name: "Chemise Oxford ivoire",
    description: "Chemise en coton oxford epais, col classique et boutons ton sur ton.",
    price: 59,
    stock: 34,
  },
  {
    category: "Nouveautes",
    name: "Pantalon Alba graphite",
    description: "Pantalon fluide a pinces, taille mi-haute et jambe legerement ample.",
    price: 84,
    stock: 26,
  },
  {
    category: "Nouveautes",
    name: "Robe Nami satin",
    description: "Robe midi en satin doux, bretelles fines et tombe souple.",
    price: 96,
    stock: 16,
  },
  {
    category: "Manteaux",
    name: "Trench Kensington sable",
    description: "Trench long de mi-saison avec ceinture, doublure legere et poches larges.",
    price: 159,
    stock: 12,
  },
  {
    category: "Manteaux",
    name: "Manteau Oslo laine",
    description: "Manteau croise en laine chaude, silhouette nette et col large.",
    price: 189,
    stock: 9,
  },
  {
    category: "Manteaux",
    name: "Veste courte Roma",
    description: "Veste courte zippee, toile compacte et coupe moderne.",
    price: 112,
    stock: 20,
  },
  {
    category: "Manteaux",
    name: "Parka Nord olive",
    description: "Parka deperlant avec capuche ajustable et grandes poches pratiques.",
    price: 149,
    stock: 11,
  },
  {
    category: "Chemises",
    name: "Chemise Popeline ciel",
    description: "Chemise en popeline de coton, coupe confortable et bleu clair lumineux.",
    price: 54,
    stock: 42,
  },
  {
    category: "Chemises",
    name: "Chemise Lin Capri",
    description: "Chemise en lin lave, texture naturelle et coupe relax.",
    price: 68,
    stock: 31,
  },
  {
    category: "Chemises",
    name: "Surchemise Atelier ecru",
    description: "Surchemise en coton epais, deux poches poitrine et boutons contrastes.",
    price: 89,
    stock: 22,
  },
  {
    category: "Chemises",
    name: "Chemise Rayee Lisbonne",
    description: "Chemise rayee bleu et blanc, esprit classique revisite.",
    price: 62,
    stock: 28,
  },
  {
    category: "T-Shirts",
    name: "T-shirt Essentiel blanc",
    description: "T-shirt en coton biologique, col rond et toucher doux.",
    price: 29,
    stock: 80,
  },
  {
    category: "T-Shirts",
    name: "T-shirt Heavy noir",
    description: "T-shirt epais premium, coupe droite et tenue impeccable.",
    price: 36,
    stock: 64,
  },
  {
    category: "T-Shirts",
    name: "Top Cotele moka",
    description: "Top ajuste en maille cotelee, encolure degagee et couleur chaude.",
    price: 34,
    stock: 37,
  },
  {
    category: "T-Shirts",
    name: "Polo Riviera marine",
    description: "Polo en coton pique, col souple et patte deux boutons.",
    price: 49,
    stock: 44,
  },
  {
    category: "Pantalons",
    name: "Jean Droit brut",
    description: "Jean droit en denim brut, cinq poches et coupe intemporelle.",
    price: 79,
    stock: 35,
  },
  {
    category: "Pantalons",
    name: "Chino Studio beige",
    description: "Chino en coton stretch, coupe fusellee et finition nette.",
    price: 72,
    stock: 40,
  },
  {
    category: "Pantalons",
    name: "Pantalon Tailleur noir",
    description: "Pantalon habille a pinces, tissu fluide et ceinture propre.",
    price: 88,
    stock: 24,
  },
  {
    category: "Pantalons",
    name: "Cargo Minimal kaki",
    description: "Pantalon cargo sobre, poches laterales plates et coupe moderne.",
    price: 82,
    stock: 27,
  },
  {
    category: "Robes",
    name: "Robe Chemise blanche",
    description: "Robe chemise en coton, ceinture amovible et longueur midi.",
    price: 89,
    stock: 19,
  },
  {
    category: "Robes",
    name: "Robe Maille noire",
    description: "Robe en maille fine, coupe ajustee et manches longues.",
    price: 92,
    stock: 17,
  },
  {
    category: "Robes",
    name: "Robe Portefeuille sauge",
    description: "Robe portefeuille fluide, imprime discret et taille ajustable.",
    price: 86,
    stock: 21,
  },
  {
    category: "Robes",
    name: "Robe Soir Studio",
    description: "Robe noire elegante, drape leger et longueur sous le genou.",
    price: 119,
    stock: 10,
  },
  {
    category: "Mailles",
    name: "Pull Merinos gris",
    description: "Pull en laine merinos, col rond et maille fine respirante.",
    price: 95,
    stock: 25,
  },
  {
    category: "Mailles",
    name: "Cardigan Cote creme",
    description: "Cardigan epais en maille cotelee, boutons nacres et coupe ample.",
    price: 98,
    stock: 18,
  },
  {
    category: "Mailles",
    name: "Col Roule Stockholm",
    description: "Pull col roule chaud, maille dense et silhouette minimaliste.",
    price: 105,
    stock: 16,
  },
  {
    category: "Mailles",
    name: "Gilet Alma noisette",
    description: "Gilet sans manches en maille douce, parfait en superposition.",
    price: 74,
    stock: 23,
  },
  {
    category: "Accessoires",
    name: "Ceinture Cuir noir",
    description: "Ceinture en cuir lisse, boucle metal brosse et largeur classique.",
    price: 42,
    stock: 50,
  },
  {
    category: "Accessoires",
    name: "Echarpe Laine camel",
    description: "Echarpe chaude en laine melangee, toucher doux et finition frangee.",
    price: 46,
    stock: 33,
  },
  {
    category: "Accessoires",
    name: "Bonnet Cote anthracite",
    description: "Bonnet en maille cotelee, revers epais et forme confortable.",
    price: 28,
    stock: 45,
  },
  {
    category: "Accessoires",
    name: "Sac Mini Atelier",
    description: "Petit sac structure, bandouliere ajustable et poche interieure.",
    price: 76,
    stock: 14,
  },
  {
    category: "Chaussures",
    name: "Sneakers Nova blanches",
    description: "Sneakers basses en cuir synthetique premium, semelle epaisse.",
    price: 99,
    stock: 30,
  },
  {
    category: "Chaussures",
    name: "Bottines Chelsea noir",
    description: "Bottines Chelsea a elastiques lateraux, ligne elegante et semelle stable.",
    price: 135,
    stock: 18,
  },
  {
    category: "Chaussures",
    name: "Mocassins Paris vernis",
    description: "Mocassins noirs vernis, bout arrondi et detail couture.",
    price: 118,
    stock: 20,
  },
  {
    category: "Chaussures",
    name: "Sandales Lina cuir",
    description: "Sandales en cuir lisse, brides fines et talon bas.",
    price: 89,
    stock: 26,
  },
];

async function upsertCategory(name: string) {
  return prisma.categories.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function upsertProduct(product: CatalogProduct, categoryId: number) {
  const existing = await prisma.products.findFirst({
    where: { name: product.name },
  });

  const data = {
    description: product.description,
    price: product.price,
    stock: product.stock,
    category_id: categoryId,
    isActive: true,
  };

  if (existing) {
    return prisma.products.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.products.create({
    data: {
      name: product.name,
      ...data,
    },
  });
}

async function main() {
  const categoryNames = [...new Set(products.map((product) => product.category))];
  const categoryByName = new Map<string, number>();

  for (const name of categoryNames) {
    const category = await upsertCategory(name);
    categoryByName.set(name, category.id);
  }

  let createdOrUpdated = 0;

  for (const product of products) {
    const categoryId = categoryByName.get(product.category);

    if (!categoryId) {
      throw new Error(`Categorie introuvable: ${product.category}`);
    }

    await upsertProduct(product, categoryId);
    createdOrUpdated += 1;
  }

  console.log(`Catalogue seed termine: ${categoryNames.length} categories, ${createdOrUpdated} produits.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
