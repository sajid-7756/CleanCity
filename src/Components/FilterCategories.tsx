interface FilterCategoriesProps {
  setCategory: (value: string) => void;
  setStatus: (value: string) => void;
}

const FilterCategories = ({ setCategory, setStatus }: FilterCategoriesProps) => {
  return (
    <div className="mb-6 flex flex-wrap justify-between gap-4">
      <select
        onChange={(event) => setCategory(event.target.value)}
        className="select select-bordered bg-white dark:bg-base-100"
      >
        <option value="all">All Categories</option>
        <option value="Garbage">Garbage</option>
        <option value="Illegal Construction">Illegal Construction</option>
        <option value="Broken Public Property">Broken Public Property</option>
        <option value="Road Damage">Road Damage</option>
      </select>

      <select
        onChange={(event) => setStatus(event.target.value)}
        className="select select-bordered bg-white dark:bg-base-100"
      >
        <option value="all">All Status</option>
        <option value="ongoing">Ongoing</option>
        <option value="ended">Ended</option>
      </select>
    </div>
  );
};

export default FilterCategories;
