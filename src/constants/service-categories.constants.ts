export const SERVICE_CATEGORY_SUGGESTIONS = [
  'Uñas',
  'Pestañas',
  'Depilación',
] as const;

export type ServiceCategorySuggestion =
  (typeof SERVICE_CATEGORY_SUGGESTIONS)[number];
