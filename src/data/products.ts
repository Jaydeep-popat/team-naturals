import type { Product } from '../types/product';

// NOTE: seed/mock data only — no backend. Reviews are fictional UI placeholders.
const HERO = "/6ecc3cac-18f0-4044-856c-cc50daf9ac26.webp";
const STORY = "/cf233d3b-a801-4fb2-9ced-7840b1e6f78e.webp";

export const heroImage = HERO;
export const storyImage = STORY;

export const products: Product[] = [
{
  id: 'p1',
  name: 'Neem Soap',
  slug: 'neem-soap',
  category: 'soaps',
  price: 80,
  weight: '125g',
  images: ["/68458ec2-cc6d-4ad9-a877-e6761b72e0fe.webp",

  HERO,
  STORY],

  shortDescription: 'Purifying neem bar that calms breakouts and clears congested skin.',
  fullDescription:
  'Cold-processed in small batches with cold-pressed neem, our Neem Soap is made for skin that needs a reset. Neem works to purify and calm active breakouts while a goat milk base keeps the bar creamy rather than stripping, so skin feels clean and comfortable instead of tight.',
  ingredients: [
  { name: 'Neem', benefit: 'Purifies and fights acne-causing bacteria' },
  { name: 'Aloe Vera', benefit: 'Soothes irritation and redness' },
  { name: 'Goat Milk Base', benefit: 'Gently nourishes without stripping' },
  { name: 'Vitamin E', benefit: 'Softens and protects the skin barrier' },
  { name: 'Vitamin C', benefit: 'Evens out dullness over time' }],

  tags: ['Handmade', 'Cruelty Free', 'No Harsh Chemicals'],
  concerns: ['Acne', 'Oily Skin', 'Sensitive Skin'],
  rating: 4.8,
  reviewCount: 126,
  bestSeller: true,
  reviews: [
  { id: 'r1', name: 'Ananya S.', rating: 5, comment: 'My breakouts calmed down within two weeks. Doesn\u2019t dry my face at all.', date: '3 weeks ago' },
  { id: 'r2', name: 'Rohit M.', rating: 5, comment: 'Smells earthy and real. You can tell it is actually handmade.', date: '1 month ago' },
  { id: 'r3', name: 'Priya K.', rating: 4, comment: 'Great for my oily T-zone. Wish the bar lasted a little longer.', date: '2 months ago' }]

},
{
  id: 'p2',
  name: 'Multani Mitti Soap',
  slug: 'multani-mitti-soap',
  category: 'soaps',
  price: 80,
  weight: '125g',
  images: ["/4d43f26a-b03f-405e-985f-c84f473e0793.webp",

  HERO,
  STORY],

  shortDescription: 'Deep-cleansing clay bar that draws out oil and leaves skin matte.',
  fullDescription:
  'Multani mitti has been used for generations to pull excess oil and impurities from the skin. We fold it into a creamy goat milk base so it cleanses deeply without leaving skin squeaky or chalky. Ideal for humid days and oily, congestion-prone skin.',
  ingredients: [
  { name: 'Multani Mitti', benefit: 'Absorbs excess oil and deep cleanses' },
  { name: 'Goat Milk Base', benefit: 'Balances the clay with gentle moisture' },
  { name: 'Vitamin E', benefit: 'Keeps skin supple after cleansing' },
  { name: 'Vitamin C', benefit: 'Brightens a tired complexion' }],

  tags: ['Handmade', 'Cruelty Free', 'No Artificial Colors'],
  concerns: ['Oily Skin', 'Dullness'],
  rating: 4.7,
  reviewCount: 98,
  bestSeller: true,
  reviews: [
  { id: 'r1', name: 'Sneha P.', rating: 5, comment: 'Perfect for Mumbai summers. Face stays matte till evening.', date: '2 weeks ago' },
  { id: 'r2', name: 'Karan V.', rating: 5, comment: 'Reminds me of my grandmother\u2019s ubtan, but far easier to use.', date: '1 month ago' },
  { id: 'r3', name: 'Divya R.', rating: 4, comment: 'Cleans really well. I follow with a moisturiser.', date: '2 months ago' },
  { id: 'r4', name: 'Imran H.', rating: 5, comment: 'Second order already. Bought one for my brother too.', date: '3 months ago' }]

},
{
  id: 'p3',
  name: 'Orange Soap',
  slug: 'orange-soap',
  category: 'soaps',
  price: 80,
  weight: '125g',
  images: ["/9420a6be-2e5d-483a-8d4d-2d9b357ae5ee.webp",

  HERO,
  STORY],

  shortDescription: 'Bright citrus bar for a fresh, awake-looking glow.',
  fullDescription:
  'A wake-up call for dull skin. Cold-pressed orange extract and Vitamin C lift tiredness from the complexion while a glycerin base keeps the bar gentle enough for daily use. The scent is real citrus peel, never synthetic fragrance.',
  ingredients: [
  { name: 'Orange Extract', benefit: 'Refreshes and revives dull skin' },
  { name: 'Vitamin C', benefit: 'Brightens and evens tone' },
  { name: 'Vitamin E', benefit: 'Nourishes and protects' },
  { name: 'Glycerin Base', benefit: 'Holds moisture in the skin' }],

  tags: ['Handmade', 'Cruelty Free', 'No Artificial Colors'],
  concerns: ['Dullness', 'Pigmentation'],
  rating: 4.6,
  reviewCount: 74,
  bestSeller: true,
  reviews: [
  { id: 'r1', name: 'Meera J.', rating: 5, comment: 'The smell alone makes my morning shower better.', date: '1 week ago' },
  { id: 'r2', name: 'Aditya N.', rating: 4, comment: 'Skin looks fresher. Subtle but real difference.', date: '1 month ago' },
  { id: 'r3', name: 'Fatima Z.', rating: 5, comment: 'Lovely lather and no dryness afterwards.', date: '2 months ago' }]

},
{
  id: 'p4',
  name: 'Coffee Soap',
  slug: 'coffee-soap',
  category: 'soaps',
  price: 80,
  weight: '125g',
  images: ["/25dcd76f-37d7-4036-b396-20449c8e4796.webp",

  HERO,
  STORY],

  shortDescription: 'Gently exfoliating coffee bar that smooths and energises skin.',
  fullDescription:
  'Freshly ground coffee gives this bar its gentle scrub, buffing away dead skin and leaving the body noticeably smoother. Natural plant oils keep the exfoliation kind rather than harsh, so it can be used two to three times a week.',
  ingredients: [
  { name: 'Coffee Powder', benefit: 'Exfoliates and boosts circulation' },
  { name: 'Natural Plant Oils', benefit: 'Cushions and conditions skin' },
  { name: 'Glycerin', benefit: 'Locks in moisture' },
  { name: 'Vitamin E', benefit: 'Keeps skin soft post-scrub' }],

  tags: ['Handmade', 'Cruelty Free', 'Skin Friendly'],
  concerns: ['Dullness', 'Dry Skin'],
  rating: 4.9,
  reviewCount: 143,
  bestSeller: true,
  reviews: [
  { id: 'r1', name: 'Nikhil B.', rating: 5, comment: 'Best body bar I have used. Skin feels polished.', date: '5 days ago' },
  { id: 'r2', name: 'Tanya D.', rating: 5, comment: 'Smells like a cafe. Scrub is gentle, not scratchy.', date: '3 weeks ago' },
  { id: 'r3', name: 'Sahil A.', rating: 5, comment: 'Bought the bundle. Whole family uses it now.', date: '2 months ago' },
  { id: 'r4', name: 'Lakshmi V.', rating: 4, comment: 'Lovely, just keep it on a draining dish so it lasts.', date: '3 months ago' }]

},
{
  id: 'p5',
  name: 'Rice Soap',
  slug: 'rice-soap',
  category: 'soaps',
  price: 80,
  weight: '125g',
  images: ["/22f656cd-e070-47f1-ad50-e243752d0d8e.webp",

  HERO,
  STORY],

  shortDescription: 'Milky rice bran bar for soft, quietly brightened skin.',
  fullDescription:
  'Inspired by traditional rice-water rituals, this creamy bar pairs rice bran with a milk base for one of the gentlest cleanses in our range. Good for sensitive and reactive skin that still wants a little brightness.',
  ingredients: [
  { name: 'Rice Bran', benefit: 'Softens and gently brightens' },
  { name: 'Milk Base', benefit: 'Cleanses without any stripping' }],

  tags: ['Handmade', 'Cruelty Free', 'No Harsh Chemicals'],
  concerns: ['Sensitive Skin', 'Dullness', 'Dry Skin'],
  rating: 4.7,
  reviewCount: 61,
  bestSeller: true,
  reviews: [
  { id: 'r1', name: 'Ishita G.', rating: 5, comment: 'The only bar my sensitive skin tolerates.', date: '2 weeks ago' },
  { id: 'r2', name: 'Manav T.', rating: 4, comment: 'Very mild and creamy. Nice for winter.', date: '1 month ago' },
  { id: 'r3', name: 'Reema C.', rating: 5, comment: 'Skin feels like silk. Repurchasing.', date: '2 months ago' }]

},
{
  id: 'p6',
  name: 'Rose Soap',
  slug: 'rose-soap',
  category: 'soaps',
  price: 80,
  weight: '125g',
  images: ["/db95c841-29e2-4a0f-bbff-d85ef56c0f30.webp",

  HERO,
  STORY],

  shortDescription: 'Hydrating rose bar that leaves a soft, dewy finish.',
  fullDescription:
  'Rose extract and rosehip oil make this our most nourishing bar. It cleanses without drawing out moisture, so skin feels hydrated and looks lit-from-within. The scent comes from real rose, kept soft and powdery.',
  ingredients: [
  { name: 'Rose Extract', benefit: 'Hydrates and calms the skin' },
  { name: 'Rosehip Oil', benefit: 'Restores glow and suppleness' },
  { name: 'Vitamin C & E', benefit: 'Brightens and protects' },
  { name: 'Glycerin Base', benefit: 'Seals in lasting moisture' }],

  tags: ['Handmade', 'Cruelty Free', 'Natural Ingredients'],
  concerns: ['Dry Skin', 'Dullness', 'Sensitive Skin'],
  rating: 4.8,
  reviewCount: 89,
  bestSeller: true,
  reviews: [
  { id: 'r1', name: 'Shreya L.', rating: 5, comment: 'Feels like a spa bar. Skin is so soft after.', date: '1 week ago' },
  { id: 'r2', name: 'Arjun P.', rating: 5, comment: 'Bought it as a gift, ended up keeping one.', date: '1 month ago' },
  { id: 'r3', name: 'Neha W.', rating: 4, comment: 'Gentle rose scent, not overpowering at all.', date: '2 months ago' }]

},
{
  id: 'p7',
  name: 'Multani Mitti Face Wash',
  slug: 'multani-mitti-face-wash',
  category: 'face-wash',
  price: 249,
  weight: '200ml',
  images: ["/bfe16391-2497-4af3-9cce-add860e6bb8a.webp",

  HERO,
  STORY],

  shortDescription: 'Clay-based daily face wash that purifies, controls oil and de-tans.',
  fullDescription:
  'Our clay face wash takes everything people love about the Multani Mitti bar and makes it a daily ritual. It lifts sweat, sunscreen and pollution, tempers excess oil through the day and gradually reduces tanning \u2014 all without the tight, stripped feeling of a foaming cleanser.',
  ingredients: [
  { name: 'Multani Mitti', benefit: 'Purifies pores and controls oil' },
  { name: 'Aloe Vera', benefit: 'Cools and soothes after sun' },
  { name: 'Vitamin E', benefit: 'Keeps skin comfortable, never tight' },
  { name: 'Glycerin', benefit: 'Maintains everyday hydration' }],

  tags: ['Handmade', 'Cruelty Free', 'No Harsh Chemicals'],
  concerns: ['Oily Skin', 'Pigmentation', 'Acne'],
  rating: 4.8,
  reviewCount: 112,
  bestSeller: true,
  reviews: [
  { id: 'r1', name: 'Pooja M.', rating: 5, comment: 'De-tanning is real. Two months in and my neck looks even.', date: '2 weeks ago' },
  { id: 'r2', name: 'Vikram S.', rating: 5, comment: 'Doesn\u2019t foam much, but face feels genuinely clean.', date: '1 month ago' },
  { id: 'r3', name: 'Aisha K.', rating: 4, comment: 'Great for oily skin. A pump would be handy though.', date: '2 months ago' },
  { id: 'r4', name: 'Deepak R.', rating: 5, comment: '200ml lasts long. Good value for a handmade product.', date: '3 months ago' }]

}];


export const categories = [
{
  label: 'Soaps',
  slug: 'soaps',
  description: 'Six cold-processed bars, 125g each',
  image: "/db95c841-29e2-4a0f-bbff-d85ef56c0f30.webp"
},
{
  label: 'Face Wash',
  slug: 'face-wash',
  description: 'Daily clay cleanser, 200ml',
  image: "/bfe16391-2497-4af3-9cce-add860e6bb8a.webp"
},
{
  label: 'Bundles',
  slug: 'bundles',
  description: 'Curated gift sets — coming soon',
  image: STORY,
  comingSoon: true,
}];


export const skinConcerns = ['Acne', 'Oily Skin', 'Dry Skin', 'Sensitive Skin', 'Dullness', 'Pigmentation'];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelated(product: Product): Product[] {
  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id);
  const rest = products.filter((p) => p.category !== product.category && p.id !== product.id);
  return [...sameCategory, ...rest].slice(0, 6);
}