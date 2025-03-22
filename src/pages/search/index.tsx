import { useCallback, useState } from "react";
import { SortDirection } from "@/types";
import { Filter, Search, X } from "lucide-react";
import { useDogsSearch } from "@/hooks/useSearchDogs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import DogFilters from "@/components/DogFilters";
import Pagination from "@/components/Pagination";
import DogResults from "@/components/DogResults";

const SearchPage = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const {
    breeds,
    dogs,
    selectedBreed,
    setSelectedBreed,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalResults,
    isLoadingPage,
    sortOption,
    setSortOption,
    setSearchParams,
    totalPages,
    hasNextPage,
    hasPrevPage
  } = useDogsSearch();

  const applyFilters = useCallback(
    () => {
      setSearchParams({
        breeds: selectedBreed,
        ageMin,
        ageMax,
        size: pageSize,
        from: (currentPage - 1) * pageSize,
        sort: `${sortOption.field}:${sortOption.direction}`
      });
      setIsMobileFiltersOpen(false);
    },
    [selectedBreed, ageMin, ageMax, pageSize, currentPage, sortOption]
  );

  const resetFilters = useCallback(
    () => {
      setSelectedBreed([]);
      setAgeMin(0);
      setAgeMax(20);
      setSortOption({ field: "breed", direction: SortDirection.ASC });
      setCurrentPage(1);
      setSearchParams({
        breeds: [],
        ageMin: 0,
        ageMax: 20,
        size: pageSize,
        from: 0,
        sort: "breed:asc"
      });
      setIsMobileFiltersOpen(false);
    },
    [
      pageSize,
      setSelectedBreed,
      setAgeMin,
      setAgeMax,
      setSortOption,
      setSearchParams
    ]
  );

  const handleSortChange = useCallback(
    (field: "breed" | "name" | "age") => {
      const newDirection =
        sortOption.field === field && sortOption.direction === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC;

      setSortOption({ field, direction: newDirection });
      setSearchParams(prev => ({ ...prev, sort: `${field}:${newDirection}` }));
    },
    [sortOption, setSortOption, setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages || newPage === currentPage)
        return;

      setCurrentPage(newPage);
      setSearchParams(prev => ({ ...prev, from: (newPage - 1) * pageSize }));
    },
    [pageSize, totalPages, currentPage, setCurrentPage, setSearchParams]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      setPageSize(newSize);
      setCurrentPage(1);
      setSearchParams(prev => ({ ...prev, size: newSize, from: 0 }));
    },
    [setPageSize, setCurrentPage, setSearchParams]
  );

  const renderMobileFilters = () =>
    <div className="absolute top-6 right-6 lg:hidden">
      <Dialog open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white shadow-sm hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-[90vh] lg:hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Dogs
            </DialogTitle>
            <DialogClose className="rounded-full hover:bg-gray-100 p-2">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-1 pb-8">
            <DogFilters
              breeds={breeds}
              selectedBreed={selectedBreed}
              setSelectedBreed={setSelectedBreed}
              ageMin={ageMin}
              setAgeMin={setAgeMin}
              ageMax={ageMax}
              setAgeMax={setAgeMax}
              sortOption={sortOption}
              handleSortChange={handleSortChange}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
              isLoadingPage={!isLoadingPage}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>;

  const renderDesktopFilters = () =>
    <div className="hidden lg:block lg:col-span-4">
      <Card className="sticky top-8 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Search Filters
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Refine your search to find the perfect match
          </p>
        </CardHeader>
        <CardContent className="border-t pt-4">
          <DogFilters
            breeds={breeds}
            selectedBreed={selectedBreed}
            setSelectedBreed={setSelectedBreed}
            ageMin={ageMin}
            setAgeMin={setAgeMin}
            ageMax={ageMax}
            setAgeMax={setAgeMax}
            sortOption={sortOption}
            handleSortChange={handleSortChange}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
            isLoadingPage={!isLoadingPage}
          />
        </CardContent>
      </Card>
    </div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 sm:p-8 mb-8">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Find Your Perfect Dog
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Browse through our selection of adorable dogs and find your
              perfect companion
            </p>
          </div>
          {renderMobileFilters()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {renderDesktopFilters()}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <DogResults
                isLoading={!isLoadingPage}
                dogs={dogs}
                totalResults={totalResults}
                sortOption={sortOption}
                onResetFilters={resetFilters}
              />
              {dogs.length > 0 &&
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    hasPrevPage={hasPrevPage}
                    hasNextPage={hasNextPage}
                  />
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
