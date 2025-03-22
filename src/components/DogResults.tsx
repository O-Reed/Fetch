import { Loader2 } from "lucide-react";

import DogCard from "@/components/DogCard";
import { Button } from "@/components/ui/button";

import { Dog, SortDirection, SortOption } from "@/types";

interface DogResultsProps {
  isLoading: boolean;
  dogs: Dog[];
  totalResults: number;
  sortOption: SortOption;
  onResetFilters: () => void;
}

const DogResults = ({
  isLoading,
  dogs,
  totalResults,
  sortOption,
  onResetFilters,
}: DogResultsProps) => {
  if (isLoading && !dogs.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dogs...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && totalResults === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-muted/10 rounded-lg">
        <div className="text-center space-y-4 p-8">
          <h3 className="text-xl font-semibold">No dogs found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try adjusting your filters or search criteria to find more dogs
          </p>
          <Button onClick={onResetFilters} variant="outline">
            Reset Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {isLoading && dogs.length > 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{dogs.length}</span> of{' '}
            <span className="font-medium">{totalResults}</span> dogs
          </p>
          <p className="text-sm font-medium">
            Sorted by: {sortOption.field} ({sortOption.direction === SortDirection.ASC ? 'A-Z' : 'Z-A'})
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              className="h-full transition-transform hover:scale-[1.02]"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DogResults;