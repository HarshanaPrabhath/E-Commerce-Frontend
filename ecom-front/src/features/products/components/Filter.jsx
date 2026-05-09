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
    const params = new URLSearchParams(searchParams);
    const handler = setTimeout(() => {
      if (searchTerm) {
        params.set("keyword", searchTerm);
      } else {
        params.delete("keyword");
      }
      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();
      if (nextQuery !== currentQuery) {
        navigate(`${pathname}?${nextQuery}`, { replace: true });
      }
    }, 700);
    return () => clearTimeout(handler);
  }, [searchTerm, navigate, pathname, searchParams]);

  const handleCategoryChange = (event) => {
    const params = new URLSearchParams(searchParams);
    const selectedCategory = event.target.value;
    if (selectedCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }
    params.delete("page");
    navigate(`${pathname}?${params.toString()}`);
    setCategory(selectedCategory);
  };

  const handleClearFilters = () => {
    navigate(pathname);
    setSearchTerm("");
    setCategory("all");
  };

  const toggleSortOrder = () => {
    const params = new URLSearchParams(searchParams);
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    params.set("sortby", newOrder);
    params.delete("page");
    navigate(`${pathname}?${params.toString()}`);
    setSortOrder(newOrder);
  };

  return (
    <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-teal-100/50 shadow-sm flex lg:flex-row flex-col lg:justify-between justify-center items-center gap-6 mb-8">
      
      {/* MODERN SEARCH BAR */}
      <div className="relative flex items-center 2xl:w-[500px] lg:w-[400px] w-full group">
        <FiSearch className="absolute left-4 text-teal-600 size-[20px] z-10 group-focus-within:text-orange-500 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          className="bg-white border border-teal-100 text-slate-800 rounded-2xl py-3 pr-4 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap lg:flex-row flex-col gap-4 items-center w-full lg:w-auto">
        
        {/* Category Select */}
        <FormControl variant="outlined" size="small" className="min-w-[160px]">
          <InputLabel id="category-label" sx={{ color: '#0f766e', '&.Mui-focused': { color: '#0f766e' } }}>Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={handleCategoryChange}
            label="Category"
            sx={{
              borderRadius: '12px',
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccfbf1' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0f766e' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f766e' },
              color: '#0f172a',
              fontWeight: 600,
              backgroundColor: 'white'
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.categoryId} value={cat.categoryName}>
                {cat.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Button */}
        <Tooltip title={`Name: ${sortOrder === 'asc' ? 'A to Z' : 'Z to A'}`}>
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-3 h-[40px] px-5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-teal-900/10"
          >
            <span>Sort By</span>
            {sortOrder === "asc" ? <FiArrowUp size={18} /> : <FiArrowDown size={18} />}
          </button>
        </Tooltip>

        {/* Clear Filter Button */}
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 h-[40px] px-5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl font-bold text-sm transition-all active:scale-95"
        >
          <FiRefreshCw className={`${searchTerm || category !== 'all' ? 'animate-spin-slow' : ''}`} size={16} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;
