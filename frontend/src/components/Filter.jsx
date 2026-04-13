import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export default function Filter({ onFilter, filteredCategory, setFilteredCategory, allcategories = [] }) {
  const handleFilterChange = (value) => {
    setFilteredCategory(value);
    onFilter(value);
  };

  return (
    <div className="md:mb-4 sm:justify-center">
      <Select id="category" value={filteredCategory} onValueChange={handleFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="All">All</SelectItem>
            {allcategories.length > 0 && allcategories.map((item, index) => (
              <SelectItem key={index} value={item?._id || item?.category}>{item?.name || item?.category}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
