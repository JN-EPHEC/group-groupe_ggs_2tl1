export function parseCategorieIdParam(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export function productsByCategoryUrl(categoryId: number): string {
  return `/produits?categorie_id=${categoryId}`;
}

export function findCategoryIdByName(
  categories: Array<{ id: number; name: string }>,
  name: string,
): number | null {
  const normalized = name.trim().toLocaleLowerCase("fr");
  const match = categories.find(
    (category) => category.name.trim().toLocaleLowerCase("fr") === normalized,
  );
  return match?.id ?? null;
}

export function categoryUrlByName(
  categories: Array<{ id: number; name: string }>,
  name: string,
  fallback = "/catalogue",
): string {
  const id = findCategoryIdByName(categories, name);
  return id ? productsByCategoryUrl(id) : fallback;
}
