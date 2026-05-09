import { useMemo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import HomeBenefitsSection from "../components/HomeBenefitsSection";
import HomeCategoriesSection from "../components/HomeCategoriesSection";
import HomeHeroSlider from "../components/HomeHeroSlider";
import HomeLatestProductsSection from "../components/HomeLatestProductsSection";
import useHomeData from "../hooks/useHomeData";

function HomePage() {
  const { products, categories, isLoading, isCategoryLoading, errorMessage, categoryError } =
    useHomeData();

  const isHomeLoading = isLoading || isCategoryLoading;
  const homeError = errorMessage || categoryError;

  const topCategories = useMemo(() => {
    const unique = new Map();
    (categories || []).forEach((item) => {
      const id = String(item?.categoryId ?? "").trim();
      const name = String(item?.categoryName ?? "").trim();
      if (id && name) {
        unique.set(name, { categoryId: id, categoryName: name });
      }
    });
    return Array.from(unique.values()).slice(0, 8);
  }, [categories]);

  return (
    <div className="bg-[#fcfcfc] overflow-x-hidden">
      <HomeHeroSlider />
      <HomeCategoriesSection isLoading={isHomeLoading} error={homeError} categories={topCategories} />
      <HomeLatestProductsSection
        isLoading={isHomeLoading}
        error={homeError}
        products={products || []}
      />
      <HomeBenefitsSection />
    </div>
  );
}

export default HomePage;
