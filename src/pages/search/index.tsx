import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dogApi } from '@/services/api';
import { SortOption, SortDirection } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDogContext } from '@/contexts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DogCard from '@/components/DogCard';
import { ChevronLeft, ChevronRight, Loader2, ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from 'lucide-react';

const SearchPage = () => {
  const {
    dogs,
    isLoading,
    isInitialLoading,
    error,
    setSearchParams,
    setPage,
    setPageSize,
    hasNextPage,
    setSortField,
    setSortDirection,
    currentPage: contextCurrentPage,
    pageSize
  } = useDogContext();

  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [ageMin, setAgeMin] = useState<string>('');
  const [ageMax, setAgeMax] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'breed',
    direction: SortDirection.ASC
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isChangingPage, setIsChangingPage] = useState<boolean>(false);

  // Sync with context current page
  useEffect(() => {
    setCurrentPage(contextCurrentPage);
  }, [contextCurrentPage]);

  // Track when dogs array changes to reset isChangingPage
  useEffect(() => {
    if (dogs.length > 0 && isChangingPage) {
      setIsChangingPage(false);
    }
  }, [dogs]);

  // Fetch all dog breeds
  const { data: allBreeds, isLoading: isLoadingBreeds } = useQuery({
    queryKey: ['breeds'],
    queryFn: dogApi.getBreeds,
  });

  // Update breeds dropdown when all breeds are fetched
  useEffect(() => {
    if (allBreeds) {
      setBreeds(allBreeds);
    }
  }, [allBreeds]);

  // Apply filters and sort
  const applyFilters = () => {
    setIsChangingPage(true); // Show loading state when applying filters
    setSearchParams({
      breeds: selectedBreed ? [selectedBreed] : [],
      ageMin: ageMin ? parseInt(ageMin) : 0,
      ageMax: ageMax ? parseInt(ageMax) : 20,
      sort: `${sortOption.field}:${sortOption.direction}`
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setIsChangingPage(true); // Show loading state when resetting filters
    setSelectedBreed('');
    setAgeMin('');
    setAgeMax('');
    setSortOption({
      field: 'breed',
      direction: SortDirection.ASC
    });
    setSearchParams({
      breeds: [],
      ageMin: 0,
      ageMax: 20,
      size: 25,
      sort: 'breed:asc'
    });
  };

  // Handle sort change
  const handleSortChange = (field: 'breed' | 'name' | 'age') => {
    setIsChangingPage(true); // Show loading state when changing sort

    // If clicking the same field, toggle direction
    if (sortOption.field === field) {
      const newDirection = sortOption.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

      setSortOption({
        field,
        direction: newDirection
      });

      setSortDirection(newDirection);
    } else {
      // If clicking a different field, set to that field with ASC direction
      setSortOption({
        field,
        direction: SortDirection.ASC
      });

      setSortField(field);
      setSortDirection(SortDirection.ASC);
    }
  };

  // Get sort icon based on current sort
  const getSortIcon = (field: 'breed' | 'name' | 'age') => {
    if (sortOption.field !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }

    return sortOption.direction === SortDirection.ASC
      ? <ArrowDownAZ className="h-4 w-4" />
      : <ArrowUpAZ className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Find Your Perfect Dog</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Select
                  value={selectedBreed}
                  onValueChange={setSelectedBreed}
                >
                  <SelectTrigger id="breed">
                    <SelectValue placeholder="Select a breed" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">All Breeds</SelectItem> */}
                    {isLoadingBreeds ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      breeds.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age-min">Minimum Age</Label>
                <Input
                  id="age-min"
                  type="number"
                  min="0"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
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
                  onChange={(e) => setAgeMax(e.target.value)}
                  placeholder="Max Age"
                />
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={sortOption.field === 'breed' ? "default" : "outline"}
                    size="md"
                    onClick={() => handleSortChange('breed')}
                    className="flex items-center justify-center gap-1"
                    disabled={isChangingPage}
                  >
                    {isChangingPage && sortOption.field === 'breed' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Breed {getSortIcon('breed')}</>
                    )}
                  </Button>
                  <Button
                    variant={sortOption.field === 'name' ? "default" : "outline"}
                    size="md"
                    onClick={() => handleSortChange('name')}
                    className="flex items-center justify-center gap-1"
                    disabled={isChangingPage}
                  >
                    {isChangingPage && sortOption.field === 'name' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Name {getSortIcon('name')}</>
                    )}
                  </Button>
                  <Button
                    variant={sortOption.field === 'age' ? "default" : "outline"}
                    size="md"
                    onClick={() => handleSortChange('age')}
                    className="flex items-center justify-center gap-1"
                    disabled={isChangingPage}
                  >
                    {isChangingPage && sortOption.field === 'age' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Age {getSortIcon('age')}</>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={applyFilters}
                  className="flex-1"
                  disabled={isChangingPage}
                >
                  {isChangingPage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="flex-1"
                  disabled={isChangingPage}
                >
                  {isChangingPage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results grid */}
        <div className="lg:col-span-3">
          {isLoading || isInitialLoading || isChangingPage ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">
                {isChangingPage ? "Loading next page..." : "Loading dogs..."}
              </span>
            </div>
          ) : error ? (
            <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
              <h3 className="font-semibold mb-2">Error loading dogs</h3>
              <p>{error}</p>
              {error.includes('401') && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded">
                  <p className="font-medium">Authentication Error</p>
                  <p className="text-sm mt-1">Your session may have expired. Try refreshing the page or logging out and back in.</p>
                </div>
              )}
            </div>
          ) : dogs.length === 0 && !isLoading && !isInitialLoading && !isChangingPage ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold">No dogs found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {dogs.length} dogs
                </p>
                <p className="text-sm font-medium">
                  Sorted by: {sortOption.field} ({sortOption.direction === SortDirection.ASC ? 'A-Z' : 'Z-A'})
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dogs.map((dog) => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                  <span>Results per page:</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setIsChangingPage(true); setPageSize(Number(value))}}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => {
                      setIsChangingPage(true);
                      setPage(currentPage - 1);
                    }}
                    disabled={currentPage === 1 || isChangingPage}
                    variant="outline"
                    size="sm"
                  >
                    {isChangingPage ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    )}
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} ({dogs.length} results)
                  </span>
                  <Button
                    onClick={() => {
                      setIsChangingPage(true);
                      setPage(currentPage + 1);
                    }}
                    disabled={!hasNextPage || isChangingPage}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    {isChangingPage ? (
                      <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
