import { Dog } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Info } from 'lucide-react';
import { formatBreedName, getAgeText, formatZipCode } from '@/lib/utils';
import { useFavorite } from '@/contexts/FavoriteContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DogCardProps {
  dog: Dog;
}

const DogCard = ({ dog }: DogCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorite();
  const isFavorited = isFavorite(dog.id);

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={dog.img}
          alt={`${dog.name} - ${dog.breed}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if dog image fails to load
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?q=80&w=500';
          }}
        />
        <Dialog>
          <DialogTrigger asChild>
            <button className="absolute bottom-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm">
              <Info className="h-4 w-4 text-gray-700" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">{dog.name}</DialogTitle>
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?q=80&w=500';
                  }}
                />
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">ID</h4>
                    <p className="text-sm">{dog.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                    <p className="text-sm">{dog.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Age</h4>
                    <p className="text-sm">{dog.age} years ({getAgeText(dog.age)})</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Breed</h4>
                    <p className="text-sm">{formatBreedName(dog.breed)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="text-sm">Zip Code: {formatZipCode(dog.zip_code)}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleToggleFavorite}
                variant={isFavorited ? "default" : "outline"}
                className="w-full gap-2 mt-2"
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{dog.name}</h3>
          <span className="text-sm bg-secondary text-secondary-foreground rounded-full px-2 py-1">
            {getAgeText(dog.age)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{formatBreedName(dog.breed)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Zip Code: {formatZipCode(dog.zip_code)}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={handleToggleFavorite}
          variant={isFavorited ? "default" : "outline"}
          className="w-full gap-2"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DogCard;
