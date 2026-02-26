import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL = "http://localhost:999";

export const FooodMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddDish, setOpenAddDish] = useState(false);
  const [openEditDish, setOpenEditDish] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    description: "",
    imageFile: null,
    imagePreview: "",
  });
  const [dishError, setDishError] = useState("");
  const [editingDishId, setEditingDishId] = useState(null);
  const [editDishError, setEditDishError] = useState("");
  const [editDish, setEditDish] = useState({
    name: "",
    price: "",
    description: "",
    imagePreview: "",
    categoryId: "",
  });

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      axios.get(`${API_BASE_URL}/foodCategory`),
      axios.get(`${API_BASE_URL}/dish`),
    ])
      .then(([categoriesRes, dishesRes]) => {
        if (!isMounted) return;
        setCategories(categoriesRes.data || []);
        setDishes(dishesRes.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch admin data", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryCountMap = useMemo(() => {
    return dishes.reduce((acc, dish) => {
      const categoryId = dish?.category?._id || dish?.category;
      if (!categoryId) return acc;
      acc[categoryId] = (acc[categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [dishes]);

  const displayDishes =
    activeCategory === "all"
      ? dishes
      : dishes.filter((dish) => {
          const categoryId = dish?.category?._id || dish?.category;
          return categoryId === activeCategory;
        });

  const groupedDishesByCategory = useMemo(() => {
    return categories
      .map((category) => {
        const items = dishes.filter((dish) => {
          const categoryId = dish?.category?._id || dish?.category;
          return categoryId === category._id;
        });

        return {
          id: category._id,
          name: category.categoryName,
          items,
        };
      });
  }, [categories, dishes]);

  const activeCategoryName =
    activeCategory === "all"
      ? "All Dishes"
      : categories.find((category) => category._id === activeCategory)
          ?.categoryName || "Category";

  const openDishEditor = (dish) => {
    setEditingDishId(dish._id);
    setEditDish({
      name: dish.name || "",
      price: dish.price ?? "",
      description: dish.description || "",
      imagePreview: dish.image || "",
      categoryId: dish?.category?._id || dish?.category || "",
    });
    setEditDishError("");
    setOpenEditDish(true);
  };

  const renderDishCard = (dish) => (
    <div
      key={dish._id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
    >
      <div className="relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-48 object-cover"
        />
        <button
          type="button"
          onClick={() => openDishEditor(dish)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
        >
          <Pencil className="w-5 h-5 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-900 flex-1">{dish.name}</h4>
          <span className="font-bold text-gray-900 ml-2">
            ${Number(dish.price).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {dish.description}
        </p>
      </div>
    </div>
  );

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required.");
      return;
    }

    const isExist = categories.some(
      (category) =>
        category.categoryName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isExist) {
      setCategoryError("This category already exists.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/foodCategory`, {
        categoryName: trimmedName,
      });

      setCategories((prev) => [...prev, res.data]);
      setActiveCategory(res.data._id);
      setNewCategoryName("");
      setCategoryError("");
      setOpenAddCategory(false);
    } catch (err) {
      setCategoryError(err?.response?.data?.message || "Failed to add category.");
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();

    const dishName = newDish.name.trim();
    const dishDescription = newDish.description.trim();
    const dishPrice = Number(newDish.price);

    if (activeCategory === "all") {
      setDishError("Please choose a specific category first.");
      return;
    }
    if (!dishName) {
      setDishError("Food name is required.");
      return;
    }
    if (!Number.isFinite(dishPrice) || dishPrice <= 0) {
      setDishError("Price must be a valid number.");
      return;
    }
    if (!dishDescription) {
      setDishError("Description is required.");
      return;
    }
    if (!newDish.imagePreview) {
      setDishError("Food image is required.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/dish`, {
        name: dishName,
        price: dishPrice,
        description: dishDescription,
        image: newDish.imagePreview,
        categoryId: activeCategory,
      });

      setDishes((prev) => [res.data, ...prev]);
      setNewDish({
        name: "",
        price: "",
        description: "",
        imageFile: null,
        imagePreview: "",
      });
      setDishError("");
      setOpenAddDish(false);
    } catch (err) {
      setDishError(err?.response?.data?.message || "Failed to add dish.");
    }
  };

  const handleEditDish = async (e) => {
    e.preventDefault();

    const dishName = editDish.name.trim();
    const dishDescription = editDish.description.trim();
    const dishPrice = Number(editDish.price);

    if (!editingDishId) {
      setEditDishError("Dish not selected.");
      return;
    }
    if (!dishName) {
      setEditDishError("Food name is required.");
      return;
    }
    if (!Number.isFinite(dishPrice) || dishPrice <= 0) {
      setEditDishError("Price must be a valid number.");
      return;
    }
    if (!dishDescription) {
      setEditDishError("Description is required.");
      return;
    }
    if (!editDish.imagePreview) {
      setEditDishError("Food image is required.");
      return;
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/dish`, {
        id: editingDishId,
        name: dishName,
        price: dishPrice,
        description: dishDescription,
        image: editDish.imagePreview,
        categoryId: editDish.categoryId,
      });

      setDishes((prev) =>
        prev.map((dish) => (dish._id === editingDishId ? res.data : dish))
      );
      setOpenEditDish(false);
      setEditingDishId(null);
      setEditDishError("");
    } catch (err) {
      setEditDishError(err?.response?.data?.message || "Failed to update dish.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Dialog
          open={openEditDish}
          onOpenChange={(open) => {
            setOpenEditDish(open);
            if (!open) {
              setEditingDishId(null);
              setEditDishError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[460px] h-[620px]">
            <form onSubmit={handleEditDish} className="grid gap-4">
              <DialogHeader>
                <DialogTitle>Edit Dish</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="flex gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-dish-name">Food name</Label>
                    <Input
                      className="w-[194px] h-[38px]"
                      id="edit-dish-name"
                      placeholder="Type food name"
                      value={editDish.name}
                      onChange={(e) => {
                        setEditDish((prev) => ({ ...prev, name: e.target.value }));
                        if (editDishError) setEditDishError("");
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-dish-price">Food price</Label>
                    <Input
                      className="w-[194px] h-[38px]"
                      id="edit-dish-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter price..."
                      value={editDish.price}
                      onChange={(e) => {
                        setEditDish((prev) => ({ ...prev, price: e.target.value }));
                        if (editDishError) setEditDishError("");
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-dish-description">Description</Label>
                  <Input
                    className="w-[412px] h-[90px]"
                    id="edit-dish-description"
                    placeholder="Write short description..."
                    value={editDish.description}
                    onChange={(e) => {
                      setEditDish((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                      if (editDishError) setEditDishError("");
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Food image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/")) {
                        setEditDishError("Please choose an image file.");
                        return;
                      }

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditDish((prev) => ({
                          ...prev,
                          imagePreview: String(reader.result || ""),
                        }));
                        if (editDishError) setEditDishError("");
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  {editDish.imagePreview ? (
                    <img
                      src={editDish.imagePreview}
                      alt="Dish preview"
                      className="h-24 w-24 rounded-md object-cover border"
                    />
                  ) : null}
                </div>
              </div>

              {editDishError && <p className="text-sm text-red-500">{editDishError}</p>}

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAddDish}
          onOpenChange={(open) => {
            setOpenAddDish(open);
            if (!open) {
              setNewDish({
                name: "",
                price: "",
                description: "",
                imageFile: null,
                imagePreview: "",
              });
              setDishError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[460px] h-[620px]">
            <form onSubmit={handleAddDish} className="grid gap-4">
              <DialogHeader>
                <DialogTitle>Add new Dish to {activeCategoryName}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="flex gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="dish-name">Food name</Label>
                    <Input
                      className="w-[194px] h-[38px]"
                      id="dish-name"
                      placeholder="Type food name"
                      value={newDish.name}
                      onChange={(e) => {
                        setNewDish((prev) => ({ ...prev, name: e.target.value }));
                        if (dishError) setDishError("");
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dish-price">Food price</Label>
                    <Input
                      className="w-[194px] h-[38px]"
                      id="dish-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter price..."
                      value={newDish.price}
                      onChange={(e) => {
                        setNewDish((prev) => ({ ...prev, price: e.target.value }));
                        if (dishError) setDishError("");
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dish-description">Description</Label>
                  <Input
                    className="w-[412px] h-[90px]"
                    id="dish-description"
                    placeholder="Write short description..."
                    value={newDish.description}
                    onChange={(e) => {
                      setNewDish((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                      if (dishError) setDishError("");
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Food image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/")) {
                        setDishError("Please choose an image file.");
                        return;
                      }

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewDish((prev) => ({
                          ...prev,
                          imageFile: file,
                          imagePreview: String(reader.result || ""),
                        }));
                        if (dishError) setDishError("");
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  {newDish.imageFile && (
                    <p className="text-xs text-gray-500">{newDish.imageFile.name}</p>
                  )}
                </div>
              </div>

              {dishError && <p className="text-sm text-red-500">{dishError}</p>}

              <DialogFooter>
                <Button type="submit">Add dish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAddCategory}
          onOpenChange={(open) => {
            setOpenAddCategory(open);
            if (!open) {
              setNewCategoryName("");
              setCategoryError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[460px] h-[272px]">
            <form onSubmit={handleAddCategory} className="grid gap-4">
              <DialogHeader>
                <DialogTitle>Add new Category</DialogTitle>
              </DialogHeader>

              <div className="grid gap-2">
                <Label>Category name</Label>
                <Input
                  className="w-[412px] h-[38px]"
                  id="category-name"
                  placeholder="Type category name..."
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (categoryError) setCategoryError("");
                  }}
                />
                {categoryError && (
                  <p className="text-sm text-red-500">{categoryError}</p>
                )}
              </div>

              <DialogFooter>
                <Button type="submit">Add category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 pb-2">Dishes category</h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                activeCategory === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
              }`}
            >
              All Dishes
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === "all"
                    ? "bg-white text-gray-800"
                    : "bg-gray-800 text-white"
                }`}
              >
                {dishes.length}
              </span>
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                  activeCategory === category._id
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
              >
                {category.categoryName}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === category._id
                      ? "bg-white text-gray-800"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {categoryCountMap[category._id] || 0}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setOpenAddCategory(true)}
              className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8">
            {activeCategory === "all" ? (
              <div className="space-y-10">
                <h3 className="text-xl font-bold">
                  {activeCategoryName} ({displayDishes.length})
                </h3>

                {groupedDishesByCategory.map((group) => (
                  <div key={group.id}>
                    <h4 className="text-lg font-bold mb-4">
                      {group.name} ({group.items.length})
                    </h4>
                    {group.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {group.items.map((dish) => renderDishCard(dish))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                        No dishes in this category yet.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-6">
                  {activeCategoryName} ({displayDishes.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      {activeCategoryName}
                    </p>
                  </div>

                  {displayDishes.map((dish) => renderDishCard(dish))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
