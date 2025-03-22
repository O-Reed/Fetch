import { useMemo } from "react";

import { Loader2, ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

import { MultiSelectOption,SortDirection, SortOption } from "@/types";
import {  } from "@/types";

interface DogFiltersProps {
  breeds: string[];
  selectedBreed: string[];
  setSelectedBreed: (breeds: string[]) => void;
  ageMin: number;
  setAgeMin: (age: number) => void;
  ageMax: number;
  setAgeMax: (age: number) => void;
  sortOption: SortOption;
  handleSortChange: (field: "breed" | "name" | "age") => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isLoadingPage?: boolean;
  onCloseMobile?: () => void;
}

const DogFilters = ({
  breeds,
  selectedBreed,
  setSelectedBreed,
  ageMin,
  setAgeMin,
  ageMax,
  setAgeMax,
  sortOption,
  handleSortChange,
  onApplyFilters,
  onResetFilters,
  isLoadingPage = false,
  onCloseMobile,
}: DogFiltersProps) => {
  const breedOptions: MultiSelectOption[] = useMemo(
    () =>
      breeds.map((breed) => ({
        label: breed,
        value: breed,
      })),
    [breeds]
  );

  const getSortIcon = (field: "breed" | "name" | "age") => {
    if (sortOption.field !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortOption.direction === SortDirection.ASC ? (
      <ArrowDownAZ className="h-4 w-4" />
    ) : (
      <ArrowUpAZ className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="breed">Breeds (Multiple Selection)</Label>
        <MultiSelect
          options={breedOptions}
          onValueChange={setSelectedBreed}
          value={selectedBreed}
          placeholder="Search breeds..."
          variant="default"
          animation={2}
          maxCount={5}
        />
        {selectedBreed.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedBreed.length} breed{selectedBreed.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="age-min">Minimum Age</Label>
        <Input
          id="age-min"
          type="number"
          min="0"
          value={ageMin}
          onChange={(e) => {
            const value = Number(e.target.value);
            setAgeMin(value >= 0 ? value : 0);
          }}
          placeholder="Min Age"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age-max">Maximum Age</Label>
        <Input
          id="age-max"
          type="number"
          min="0"
          value={ageMax}
          onChange={(e) => {
            const value = Number(e.target.value);
            setAgeMax(value >= 0 ? value : 0);
          }}
          placeholder="Max Age"
        />
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <div className="grid grid-cols-3 gap-2">
          {["breed", "name", "age"].map((field) => (
            <Button
              key={field}
              variant={sortOption.field === field ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange(field as "breed" | "name" | "age")}
              className="flex items-center justify-center gap-1"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {getSortIcon(field as "breed" | "name" | "age")}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button
          onClick={() => {
            onApplyFilters();
            onCloseMobile?.();
          }}
          className="flex-1"
          disabled={isLoadingPage}
        >
          {isLoadingPage ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying...
            </div>
          ) : (
            "Apply Filters"
          )}
        </Button>
        <Button
          onClick={() => {
            onResetFilters();
            onCloseMobile?.();
          }}
          variant="outline"
          className="flex-1"
          disabled={isLoadingPage}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default DogFilters;