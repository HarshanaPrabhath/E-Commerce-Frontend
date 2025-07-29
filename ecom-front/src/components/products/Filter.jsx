import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiSearch } from "react-icons/fi";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Filter = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);

  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const currentCategory = searchParams.get("category") || "all";
    const currentSortOrder = searchParams.get("sortby") || "asc";
    const currentSearchTerm = searchParams.get("keyword") || "";

    setCategory(currentCategory);
    setSortOrder(currentSortOrder);
    setSearchTerm(currentSearchTerm);
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        searchParams.set("keyword", searchTerm);
      } else {
        searchParams.delete("keyword");
      }
      navigate(`${pathname}?${searchParams.toString()}`); // ✅ Fixed
    }, 700);
    return () => {
      clearTimeout(handler);
    };
  }, [searchParams, searchTerm, navigate, pathname]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }
    navigate(`${pathname}?${params.toString()}`); // ✅ Fixed
    setCategory(selectedCategory);
  };

  const handleClearFilters = () => {
    navigate(pathname); // ✅ Clean URL without query
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === "asc" ? "desc" : "asc";
      params.set("sortby", newOrder);
      navigate(`${pathname}?${params.toString()}`); // ✅ Fixed
      return newOrder;
    });
  };

  return (
    <div className="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4">
      {/* SEARCH BAR */}
      <div className="relative mt-4 lg:mt-0 flex items-center 2xl:w-[450px] sm:w-[420px] w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Products"
          className="border border-gray-400 text-slate-800 rounded-md py-2 pr-4 pl-10 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <FiSearch className="absolute left-3 text-slate-400 size-[20px]" />
      </div>

      {/* Category Select */}
      <div className="flex lg:flex-row flex-col gap-4 items-center">
        <FormControl variant="outlined" size="small">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            onChange={handleCategoryChange}
            label="Category"
            className="min-w-[120px] text-slate-800 border-slate-700"
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.categoryId} value={cat.categoryName}>
                {cat.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Button */}
        <Tooltip title={`Sorted by price: ${sortOrder}`}>
          <Button
            onClick={toggleSortOrder}
            variant="contained"
            color="primary"
            className="flex items-center gap-2 h-10"
          >
            Sort By
            {sortOrder === "asc" ? <FiArrowUp size={20} /> : <FiArrowDown size={20} />}
          </Button>
        </Tooltip>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 bg-rose-800 hover:bg-rose-700 text-white px-3 py-2 rounded transition duration-300 ease-in shadow-md focus:outline-none"
        >
          <FiRefreshCw className="font-semibold" size={16} />
          <span className="font-semibold">Clear Filter</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;
