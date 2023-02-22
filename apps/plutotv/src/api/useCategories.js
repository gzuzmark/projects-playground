import { useEffect, useState } from "react";

function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getCategories() {
      const categories = await fetch("http://localhost:4000/categories");
      const result = await categories.json();

      // Convert json object to array removing the key and just takin the value
      const categoriesArray = Object.values(result);
      console.log("usecategories:", categoriesArray);
      setCategories(categoriesArray);
    }
    getCategories();
  }, []);

  return categories;
}

export { useCategories };
