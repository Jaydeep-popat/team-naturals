export type Category = 'soaps' | 'face-wash' | 'bundles';

export interface Ingredient {
  name: string;
  benefit: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price: number;
  weight: string;
  images: string[];
  shortDescription: string;
  fullDescription: string;
  ingredients: Ingredient[];
  tags: string[];
  concerns: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  bestSeller?: boolean;
}

export interface CartLine {
  product: Product;
  quantity: number;
}