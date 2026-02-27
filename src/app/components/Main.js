"use client";

import { useEffect, useState } from "react";
import { addDishToCart } from "@/lib/orderCartStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://food-delivery-back-1-wfja.onrender.com";

const fallbackSections = [
  {
    title: "Appetizers",
    items: [
      { name: "Finger food", price: 12.99, description: "Crispy bites with sauce." },
      { name: "Cranberry Brie Bites", price: 12.99, description: "Sweet and savory starter." },
      { name: "Sunshine Stackers", price: 12.99, description: "Fresh layered toast bites." },
    ],
  },
  {
    title: "Salads",
    items: [
      { name: "Grilled Chicken cobb salad", price: 12.99, description: "Protein-packed salad bowl." },
      { name: "Burrata Caprese", price: 12.99, description: "Tomato, basil and burrata." },
      { name: "Beetroot and orange salad", price: 12.99, description: "Bright citrus salad mix." },
    ],
  },
  {
    title: "Lunch favorites",
    items: [
      { name: "Sunshine Stackers", price: 12.99, description: "Chef special lunch plate." },
      { name: "Grilled chicken", price: 12.99, description: "Grilled chicken with sides." },
      { name: "Steak bites", price: 15.99, description: "Tender steak bites in sauce." },
    ],
  },
  {
    title: "Desserts",
    items: [
      { name: "Cheese cake", price: 8.99, description: "Classic creamy cheesecake." },
      { name: "Chocolate brownie", price: 7.99, description: "Rich chocolate brownie." },
      { name: "Fruit tart", price: 8.99, description: "Fresh fruit tart slice." },
    ],
  },
];

const cardBackgrounds = [
  "linear-gradient(135deg, #6b2d1f 0%, #d07b3f 45%, #2c201b 100%)",
  "linear-gradient(135deg, #f3d59b 0%, #bb4a4f 40%, #7f2d2d 100%)",
  "linear-gradient(135deg, #cf7d4f 0%, #f6dca8 45%, #8e5537 100%)",
  "linear-gradient(135deg, #532f22 0%, #d2a08a 45%, #a32735 100%)",
  "linear-gradient(135deg, #9e4f2e 0%, #f0ca72 40%, #5f2f1c 100%)",
  "linear-gradient(135deg, #e9d18e 0%, #d96a4f 45%, #7f8b56 100%)",
];

export default function Main() {
  const [activeCategory, setActiveCategory] = useState("All dishes");
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetch(`${API_BASE_URL}/foodCategory`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/dish`).then((res) => res.json()),
    ])
      .then(([categoryData, dishData]) => {
        if (!isMounted) return;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setDishes(Array.isArray(dishData) ? dishData : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setCategories([]);
        setDishes([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const hasApiData = categories.length > 0 || dishes.length > 0;

  const allDishItems = dishes.map((dish) => ({
    _id: dish._id,
    name: dish.name || "Unnamed dish",
    price: Number(dish.price) || 0,
    description: dish.description || "No description",
    image: dish.image || "",
  }));

  const apiSections = categories
    .map((category) => {
      const categoryId = category?._id;
      const items = dishes
        .filter((dish) => {
          const dishCategoryId = dish?.category?._id || dish?.category;
          return dishCategoryId === categoryId;
        })
        .map((dish) => ({
          _id: dish._id,
          name: dish.name || "Unnamed dish",
          price: Number(dish.price) || 0,
          description: dish.description || "No description",
          image: dish.image || "",
        }));

      return {
        id: categoryId,
        title: category.categoryName || "Category",
        items,
      };
    })
    .filter((section) => section.items.length > 0);

  const uncategorizedSections =
    categories.length === 0 && allDishItems.length > 0
      ? [
          {
            id: "uncategorized",
            title: "All dishes",
            items: allDishItems,
          },
        ]
      : [];

  const sections = hasApiData
    ? apiSections.length > 0
      ? apiSections
      : uncategorizedSections
    : fallbackSections.map((section, index) => ({
        id: `fallback-${index}`,
        title: section.title,
        items: section.items.map((item, itemIndex) => ({
          _id: `fallback-${index}-${itemIndex}`,
          ...item,
          image: "",
        })),
      }));

  const totalDishCount = hasApiData
    ? allDishItems.length
    : sections.reduce((sum, section) => sum + section.items.length, 0);

  const handleAddToCart = (item) => {
    addDishToCart(item);
  };

  const visibleSections =
    activeCategory === "All dishes"
      ? sections
      : sections.filter((section) => section.title === activeCategory);

  return (
    <main>
      <section className="bg-[#F3EFE7]">
        <div
          className="mx-auto h-[638px] w-full max-w-[1440px] bg-cover bg-center"
          style={{ backgroundImage: "url('/Image÷.png')" }}
        />
      </section>

      <section className="bg-[#3F3F46]">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Dishes category</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveCategory("All dishes")}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCategory === "All dishes"
                    ? "border-[#1F2937] bg-[#1F2937] text-white"
                    : "border-white/20 bg-white/5 text-white"
                }`}
              >
                All dishes ({totalDishCount})
              </button>

              {sections.map((section) => (
                <button
                  key={section.id || section.title}
                  onClick={() => setActiveCategory(section.title)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    activeCategory === section.title
                      ? "border-[#1F2937] bg-[#1F2937] text-white"
                      : "border-white/20 bg-white/5 text-white"
                  }`}
                >
                  {section.title} ({section.items.length})
                </button>
              ))}
            </div>
          </div>

          {visibleSections.map((section, sectionIndex) => (
            <div key={section.id || `${section.title}-${sectionIndex}`} className="mb-12 last:mb-0">
              <h2 className="mb-5 text-2xl font-semibold text-white">{section.title}</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item, itemIndex) => (
                  <article
                    key={item._id || `${item.name}-${itemIndex}`}
                    className="rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                  >
                    <div className="relative h-36 overflow-hidden rounded-xl">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            background:
                              cardBackgrounds[(sectionIndex * 3 + itemIndex) % cardBackgrounds.length],
                          }}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.28),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(0,0,0,0.18),transparent_60%)]" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-500 shadow transition hover:bg-red-500 hover:text-white"
                        aria-label={`Add ${item.name} to cart`}
                      >
                        +
                      </button>
                    </div>

                    <div className="px-1 pb-1 pt-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="max-w-[75%] truncate text-sm font-semibold text-red-500">
                          {item.name}
                        </p>
                        <p className="shrink-0 text-xs font-semibold text-[#18181B]">
                          ${Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-2 text-[10px] leading-4 text-[#52525B]">
                        {item.description || "No description"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
