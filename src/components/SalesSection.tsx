
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Product } from '../types/Product';
import ProductGrid from './ProductGrid';

const SalesSection = () => {
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const fetchSaleProducts = async () => {
    try {
      // Fetch active sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString());

      if (salesError) throw salesError;

      // Only fetch products that have active sales
      const productIds = salesData?.map(sale => sale.product_id).filter(Boolean) || [];
      
      if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
          .eq('is_active', true)
          .limit(8); // Show only 8 products on home page

        if (productsError) throw productsError;

        // Map sale prices to products
        const productsWithSales = productsData?.map(product => {
          const sale = salesData?.find(s => s.product_id === product.id);
          return {
            ...product,
            originalPrice: sale?.original_price || product.price,
            price: sale?.sale_price || product.price,
            saleInfo: sale ? {
              title: sale.sale_title,
              description: sale.sale_description,
              endDate: sale.end_date
            } : undefined
          };
        }) || [];

        setSaleProducts(productsWithSales);
      }
    } catch (error) {
      console.error('Error fetching sale products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (saleProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Sale Products</h2>
          <p className="text-gray-600 text-lg">Don't miss out on these amazing deals!</p>
        </div>
        
        <ProductGrid products={saleProducts} />
        
        <div className="text-center mt-8">
          <a 
            href="/sales" 
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            View All Sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default SalesSection;
