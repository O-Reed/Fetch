import { useState, useEffect, useMemo } from 'react';
import { Dog, DogSearchParams, SortOption, SortDirection } from '@/types';
import { useBreeds } from '@/apis/dogs/useBreeds';
import { useSearchDogs } from '@/apis/dogs/useSearchDogs';

export const useDogsSearch = (initialPageSize = 25) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number>(0);
  const [ageMax, setAgeMax] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "breed",
    direction: SortDirection.ASC
  });

  const [searchParams, setSearchParams] = useState<DogSearchParams>({
    breeds: [],
    ageMin: 0,
    ageMax: 20,
    size: pageSize,
    from: 0,
    sort: "breed:asc"
  });

  const { allBreeds } = useBreeds();
  const fetchDogsResult = useSearchDogs(searchParams);

  const totalPages = useMemo(() => 
    Math.ceil(totalResults / pageSize), 
    [totalResults, pageSize]
  );
  
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  useEffect(() => {
    if (allBreeds) {
      setBreeds(allBreeds);
    }

    if (fetchDogsResult?.DogDetails?.allDogs) {
      setDogs(Array.isArray(fetchDogsResult.DogDetails.allDogs) ? fetchDogsResult.DogDetails.allDogs : [fetchDogsResult.DogDetails.allDogs]);
      setTotalResults(fetchDogsResult.allSearchDogs?.total ?? 0);
      setIsLoadingPage(fetchDogsResult.isSuccess || fetchDogsResult.isError);
    }
  }, [allBreeds, fetchDogsResult]);

  useEffect(() => {
    if (searchParams.sort) {
      const [field, direction] = searchParams.sort.split(":");
      if (field && (field === "breed" || field === "name" || field === "age")) {
        setSortOption({
          field: field as "breed" | "name" | "age",
          direction: direction as SortDirection
        });
      }
    }
  }, [searchParams.sort]);

  return {
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
    searchParams,
    setSearchParams,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};