export type MenuItem = {
  name: string;
  description?: string;
  /** Precios en MXN por tamaño. `null` cuando el tamaño no aplica. */
  chico: number | null;
  mediano: number | null;
  grande: number | null;
  /** Calorías aproximadas por porción. */
  calories: number;
};

export type MenuCategory = {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "calientes",
    title: "Bebidas calientes",
    description: "Café de especialidad recién extraído, servido al momento.",
    items: [
      { name: "Espresso", description: "Doble carga, cuerpo intenso", chico: 38, mediano: 45, grande: null, calories: 5 },
      { name: "Americano", description: "Espresso y agua caliente", chico: 40, mediano: 48, grande: 55, calories: 5 },
      { name: "Capuchino", description: "Espuma sedosa y canela", chico: 48, mediano: 56, grande: 64, calories: 150 },
      { name: "Latte", description: "Leche vaporizada, textura cremosa", chico: 50, mediano: 58, grande: 66, calories: 180 },
      { name: "Mocha", description: "Chocolate belga y espresso", chico: 55, mediano: 63, grande: 72, calories: 250 },
      { name: "Chocolate canela", description: "Chocolate de mesa con canela", chico: 52, mediano: 60, grande: 68, calories: 220 },
      { name: "Té de la casa", description: "Manzanilla, menta o frutos rojos", chico: 35, mediano: 42, grande: null, calories: 0 },
    ],
  },
  {
    id: "frappes",
    title: "Frappés",
    description: "Cremosos, batidos con hielo y coronados con crema.",
    items: [
      { name: "Frappé Canela", description: "Nuestra receta insignia", chico: 62, mediano: 72, grande: 82, calories: 300 },
      { name: "Frappé Moka", description: "Café, cacao y crema batida", chico: 62, mediano: 72, grande: 82, calories: 320 },
      { name: "Frappé Caramelo", description: "Caramelo salado artesanal", chico: 64, mediano: 74, grande: 84, calories: 330 },
      { name: "Frappé Oreo", description: "Galleta triturada y vainilla", chico: 66, mediano: 76, grande: 86, calories: 350 },
      { name: "Frappé Matcha", description: "Matcha ceremonial japonés", chico: 68, mediano: 78, grande: 88, calories: 300 },
    ],
  },
  {
    id: "frias",
    title: "Bebidas frías",
    description: "Para los días de sol en la terraza.",
    items: [
      { name: "Cold brew", description: "Extracción lenta de 18 horas", chico: 55, mediano: 65, grande: 75, calories: 5 },
      { name: "Latte frío", description: "Espresso sobre hielo y leche", chico: 52, mediano: 62, grande: 72, calories: 180 },
      { name: "Limonada de canela", description: "Cítrica, con toque especiado", chico: 45, mediano: 55, grande: 62, calories: 120 },
      { name: "Té helado de durazno", description: "Té negro y durazno natural", chico: 45, mediano: 55, grande: 62, calories: 0 },
      { name: "Agua del día", description: "Fruta de temporada", chico: 32, mediano: 40, grande: 48, calories: 0 },
    ],
  },
  {
    id: "alimentos",
    title: "Para acompañar",
    description: "Panadería y platillos preparados en casa.",
    items: [
      { name: "Concha de canela", description: "Horneada cada mañana", chico: 32, mediano: null, grande: null, calories: 250 },
      { name: "Croissant de almendra", description: "Hojaldre con crema de almendra", chico: 55, mediano: null, grande: null, calories: 300 },
      { name: "Pan de elote", description: "Con cajeta y nuez", chico: 48, mediano: null, grande: null, calories: 280 },
      { name: "Molletes Canela", description: "Frijol, queso gratinado y pico de gallo", chico: 78, mediano: 95, grande: null, calories: 400 },
      { name: "Chilaquiles de la casa", description: "Verdes o rojos, con pollo", chico: 105, mediano: 125, grande: null, calories: 450 },
      { name: "Sándwich de jamón serrano", description: "Pan artesanal y queso manchego", chico: 98, mediano: 118, grande: null, calories: 400 },
    ],
  },
];
