import { useState } from "react";
import { Search, Filter as FilterIcon, X } from "lucide-react";

const Filter = ({ expenses, onFilteredExpenses, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleFilter = () => {
    let filtered = [...expenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        expense.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case "date":
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    onFilteredExpenses(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("date");
    setSortOrder("desc");
    onFilteredExpenses(expenses);
  };

  const hasActiveFilters =
    searchTerm || selectedCategory || sortBy !== "date" || sortOrder !== "desc";

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h3>
          <FilterIcon size={20} />
          Filter & Search
        </h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>

      <div className="filter-controls">
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search">
            <Search size={16} />
            Search Expenses
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="search-input"
          />
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label htmlFor="sort-by">Sort By</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label htmlFor="sort-order">Order</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Apply Filter Button */}
        <button onClick={handleFilter} className="apply-filter-btn">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
