import { Heart, Info } from "lucide-react";
import { useFavorite } from "@/contexts/FavoriteContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Dog } from "@/types";
import { formatBreedName, getAgeText, formatZipCode, cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface DogCardProps {
  dog: Dog;
  className?: string;
}

const DogCard = ({ dog, className }: DogCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorite();
  const isFavorited = isFavorite(dog.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
    <Card
      className={cn("overflow-hidden h-full flex flex-col group", className)}
    >
      <div className="relative h-48">
        <img
          src={dog.img}
          alt={`${dog.name} - ${dog.breed}`}
          className="w-full h-full object-cover"
          onError={e => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?q=80&w=500";
          }}
        />
        <div className="absolute top-2 inset-x-2 flex justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                title="View details"
              >
                <Info className="h-4 w-4 text-gray-700" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {dog.name}
                </DialogTitle>
                <DialogDescription>
                  All details about this dog
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src={dog.img}
                    alt={`${dog.name} - ${dog.breed}`}
                    className="w-full h-48 object-cover rounded-md"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?q=80&w=500";
                    }}
                  />
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">ID</h4>
                      <p className="text-sm">
                        {dog.id}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Name
                      </h4>
                      <p className="text-sm">
                        {dog.name}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Age</h4>
                      <p className="text-sm">
                        {dog.age} years ({getAgeText(dog.age)})
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Breed
                      </h4>
                      <p className="text-sm">
                        {formatBreedName(dog.breed)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Location
                      </h4>
                      <p className="text-sm">
                        Zip Code: {formatZipCode(dog.zip_code)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleToggleFavorite}
                  variant={isFavorited ? "default" : "outline"}
                  className="w-full gap-2 mt-2"
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
                  />
                  {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <button
            onClick={handleToggleFavorite}
            className={cn(
              "p-2 rounded-full shadow-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary",
              isFavorited
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-white/80 hover:bg-white"
            )}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorited ? "fill-current" : "text-gray-700"
              )}
            />
          </button>
        </div>

        <div className="absolute bottom-2 left-2">
          <span className="text-sm bg-black/50 text-white rounded-full px-2 py-1 backdrop-blur-sm">
            {getAgeText(dog.age)}
          </span>
        </div>
      </div>

      <CardContent className="pt-4 flex-grow">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-none">
            {dog.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatBreedName(dog.breed)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatZipCode(dog.zip_code)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogCard;
