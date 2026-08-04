import { ProductForm } from '@/src/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <ProductForm isEdit={false} />
    </div>
  );
}
