'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchXIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { categories, skinConcerns } from '@/src/data/products';
import { products as productsApi } from '@/src/lib/api';
import type { Product, Category } from '@/src/types/product';
import { ProductCard } from '@/src/components/ProductCard';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { ProductGridSkeleton } from '@/src/components/Skeletons';
import { usePageLoad } from '@/src/hooks/usePageLoad';
import { staggerContainer, staggerItem } from '@/src/components/Reveal';
import toast from 'react-hot-toast';

type SortKey = 'popularity' | 'price-asc' | 'price-desc';

const priceBands = [
  { label: 'Under ₹100', min: 0, max: 99 },
  { label: '₹100 – ₹250', min: 100, max: 250 },
  { label: 'Above ₹250', min: 251, max: Infinity },
];

export default function ShopPageClient({
  categoryMeta,
}: {
  categoryMeta?: { name: string; slug: string; description?: string | null };
} = {}) {
  const params = useParams();
  const category = params?.category as string | undefined;
  const loading = usePageLoad(700);

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('popularity');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  React.useEffect(() => {
    productsApi
      .list()
      .then((res) => setLiveProducts(res.data.products))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load products');
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const activeCategory = categoryMeta
    ? { slug: categoryMeta.slug, label: categoryMeta.name }
    : categories.find((c) => c.slug === category);

  const results = useMemo(() => {
    let list = liveProducts.filter((p) =>
      category
        ? typeof p.category === 'object' && p.category !== null
          ? p.category.slug === category
          : p.category === category
        : true
    );
    if (selectedCategories.length) {
      list = list.filter((p) =>
        selectedCategories.includes(
          typeof p.category === 'object' && p.category !== null ? p.category.slug : p.category
        )
      );
    }
    if (selectedBands.length) {
      list = list.filter((p) =>
        selectedBands.some((label) => {
          const band = priceBands.find((b) => b.label === label);
          return band ? p.price >= band.min && p.price <= band.max : true;
        })
      );
    }
    if (selectedConcerns.length) {
      list = list.filter((p) => (p.concerns || []).some((c: string) => selectedConcerns.includes(c)));
    }
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'popularity') sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    return sorted;
  }, [category, selectedCategories, selectedBands, selectedConcerns, sort, liveProducts]);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBands([]);
    setSelectedConcerns([]);
  };

  const activeFilterCount =
    selectedCategories.length + selectedBands.length + selectedConcerns.length;

  const filterPanel = (
    <FilterPanel
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      selectedBands={selectedBands}
      setSelectedBands={setSelectedBands}
      selectedConcerns={selectedConcerns}
      setSelectedConcerns={setSelectedConcerns}
      lockedCategory={!!category}
      onClear={clearAll}
      activeFilterCount={activeFilterCount}
    />
  );

  return (
    <div className="w-full bg-white">
      <header className="border-b border-forest/8 bg-cream-soft">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center lg:px-8">
          <h1 className="font-display text-3xl text-forest sm:text-4xl">
            {activeCategory ? activeCategory.label : 'Shop All'}
          </h1>
          <div className="mt-3 flex justify-center">
            <Breadcrumb
              items={[
                { label: 'Home', to: '/' },
                ...(activeCategory
                  ? [{ label: 'Shop', to: '/shop' }, { label: activeCategory.label }]
                  : [{ label: 'Shop' }]),
              ]}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-8 lg:px-8">
        <aside className="hidden w-60 flex-shrink-0 lg:block">{filterPanel}</aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {loading
                ? 'Loading products…'
                : `${results.length} product${results.length === 1 ? '' : 's'}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-full border border-forest/15 px-4 py-2 text-sm text-forest lg:hidden"
              >
                <SlidersHorizontalIcon size={15} strokeWidth={1.7} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[10px] text-cream">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <label className="sr-only" htmlFor="sort">
                Sort products
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-forest/15 bg-white px-4 py-2 text-sm text-forest outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>

          {loading || loadingProducts ? (
            <ProductGridSkeleton count={6} />
          ) : results.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <motion.div
              key={`${category}-${sort}-${activeFilterCount}`}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:gap-6"
            >
              {results.map((p) => {
                const productId = (p as any).productId || p.id;
                return (
                  <motion.div key={productId} variants={staggerItem}>
                    <ProductCard product={p} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-forest/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[71] max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl text-forest">Filters</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="rounded-full p-2 text-forest hover:bg-forest/5"
                  aria-label="Close filters"
                >
                  <XIcon size={19} strokeWidth={1.6} />
                </button>
              </div>
              {filterPanel}
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full rounded-full bg-forest px-6 py-3.5 text-sm text-cream"
              >
                Show {results.length} products
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterPanelProps {
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedBands: string[];
  setSelectedBands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedConcerns: string[];
  setSelectedConcerns: React.Dispatch<React.SetStateAction<string[]>>;
  lockedCategory: boolean;
  onClear: () => void;
  activeFilterCount: number;
}

function FilterPanel({
  selectedCategories,
  setSelectedCategories,
  selectedBands,
  setSelectedBands,
  selectedConcerns,
  setSelectedConcerns,
  lockedCategory,
  onClear,
  activeFilterCount,
}: FilterPanelProps) {
  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, value: T) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-forest">Refine</h2>
        {activeFilterCount > 0 && (
          <button type="button" onClick={onClear} className="text-xs text-terracotta hover:underline">
            Clear all
          </button>
        )}
      </div>

      {!lockedCategory && (
        <FilterGroup title="Category">
          {categories
            .filter((c) => c.slug !== 'bundles')
            .map((c) => (
              <Check
                key={c.slug}
                label={c.label}
                checked={selectedCategories.includes(c.slug as Category)}
                onChange={() => toggle(setSelectedCategories, c.slug as Category)}
              />
            ))}
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        {priceBands.map((b) => (
          <Check
            key={b.label}
            label={b.label}
            checked={selectedBands.includes(b.label)}
            onChange={() => toggle(setSelectedBands, b.label)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Skin concern">
        <div className="flex flex-wrap gap-2">
          {skinConcerns.map((c) => {
            const active = selectedConcerns.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(setSelectedConcerns, c)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-forest bg-forest text-cream'
                    : 'border-forest/15 text-muted hover:border-forest/30 hover:text-forest'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm text-forest">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted transition-colors hover:text-forest">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-forest/25 text-forest accent-[#1F3D2B]"
      />
      {label}
    </label>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-forest/15 bg-cream-soft px-6 py-16 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-forest">
        <SearchXIcon size={24} strokeWidth={1.4} />
      </span>
      <h2 className="font-display text-xl text-forest">Nothing matches those filters</h2>
      <p className="max-w-xs text-sm text-muted">
        Try widening the price range or removing a skin concern to see more of the collection.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-1 rounded-full bg-forest px-6 py-3 text-sm text-cream transition-colors hover:bg-forest-deep"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}
