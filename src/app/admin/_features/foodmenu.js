import React, { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const FooodMenu = () => {
  const [activeCategory, setActiveCategory] = useState("All Dishes");
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddDish, setOpenAddDish] = useState(false);

  const categories = [
    { name: "All Dishes", count: 112 },
    { name: "Appetizers", count: 6 },
    { name: "Salads", count: 3 },
    { name: "Pizzas", count: 5 },
    { name: "Lunch favorites", count: 5 },
    { name: "Main dishes", count: 5 },
    { name: "Fish & Sea foods", count: 5 },
    { name: "Brunch", count: 5 },
    { name: "Side dish", count: 5 },
    { name: "Desserts", count: 5 },
    { name: "Beverages", count: 5 },
  ];

  const dishes = {
    Pizzas: [
      {
        id: 1,
        name: "Grilled Chicken cobb salad",
        price: 12.99,
        description:
          "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      },
      {
        id: 2,
        name: "Burrata Caprese",
        price: 12.99,
        description:
          "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
      },
      {
        id: 3,
        name: "Beetroot and orange salad",
        price: 12.99,
        description:
          "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      },
      {
        id: 4,
        name: "Grilled Chicken cobb salad",
        price: 12.99,
        description:
          "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      },
      {
        id: 5,
        name: "Grilled Chicken cobb salad",
        price: 12.99,
        description:
          "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      },
    ],
    "Lunch favorites": [
      {
        id: 6,
        name: "Caesar Salad",
        price: 11.99,
        description: "Fresh romaine lettuce with parmesan and croutons.",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      },
      {
        id: 7,
        name: "Caprese Sandwich",
        price: 13.99,
        description: "Fresh mozzarella, tomatoes, and basil on ciabatta.",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
      },
      {
        id: 8,
        name: "Summer Bowl",
        price: 14.99,
        description: "Mixed greens with seasonal vegetables and vinaigrette.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      },
    ],
  };

  const getCategoryDishes = (category) => {
    if (category === "All Dishes") {
      return [
        ...(dishes["Pizzas"] || []),
        ...(dishes["Lunch favorites"] || []),
      ];
    }
    return dishes[category] || [];
  };

  const displayDishes = getCategoryDishes(activeCategory);
  const AddCategory = () => {};

  return (
    <div className="min-h-screen  bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Dialog open={openAddDish} onOpenChange={setOpenAddDish}>
          <form>
            <DialogContent className="sm:max-w-[460px] h-[592px]">
              <DialogHeader>
                <DialogTitle>Add new Dish to Appetizers</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="flex gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name-1">Food name</Label>
                    <Input
                      className="w-[194px] h-[38px]"
                      id="name-1"
                      name="name"
                      placeholder="Type food name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username-1">Food price</Label>
                    <Input
                      className="w-[194px] h-[38px]"
                      id="price"
                      name="price"
                      placeholder="Enter price..."
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Ingredients</Label>
                  <Input
                    className="w-[412px] h-[90px]"
                    id="ingredients"
                    name="ingredients"
                    placeholder="List ingredients..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Food image</Label>
                  <Input type="file" name="foodimage" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add dish</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
        <Dialog open={openAddCategory} onOpenChange={setOpenAddCategory}>
          <form>
            <DialogContent className="sm:max-w-[460px] h-[272px]">
              <DialogHeader>
                <DialogTitle>Add new Category</DialogTitle>
              </DialogHeader>

              <div className="grid gap-2">
                <Label>Category name</Label>
                <Input
                  className="w-[412px] h-[38px]"
                  id="ingredients"
                  name="ingredients"
                  placeholder="Type category name..."
                />
              </div>

              <DialogFooter>
                <Button type="submit">Add dish</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
        ) ;{/* Dishes Category */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6  pb-2 ">Dishes category</h2>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                  activeCategory === category.name
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
              >
                {category.name}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === category.name
                      ? "bg-white text-gray-800"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}

            <button
              onClick={() => setOpenAddCategory(true)}
              className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Dishes Grid */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-6">
              {activeCategory} ({displayDishes.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Add New Dish Card */}
              <div
                onClick={() => setOpenAddDish(true)}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] hover:border-red-400 transition cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <p className="text-center text-gray-700 font-medium">
                  Add new Dish to
                  <br />
                  {activeCategory}
                </p>
              </div>

              {/* Dish Cards */}
              {displayDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition">
                      <Pencil className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 flex-1">
                        {dish.name}
                      </h4>
                      <span className="font-bold text-gray-900 ml-2">
                        ${dish.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
