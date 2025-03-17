import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorite } from '@/contexts';
import { dogApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DogCard from '@/components/DogCard';
import { AlertTriangle, Heart, Loader2 } from 'lucide-react';

const FavoritesPage = () => {
  const { favorites, setMatchedDog } = useFavorite();
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      toast({
        title: 'No favorites selected',
        description: 'Please add at least one dog to your favorites before generating a match.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingMatch(true);
    
    try {
      // Get all the dog IDs from favorites
      const dogIds = favorites.map(dog => dog.id);
      
      // Call the match endpoint
      const matchResponse = await dogApi.getMatch(dogIds);
      
      // Find the matched dog from our favorites
      const matchedDog = favorites.find(dog => dog.id === matchResponse.match);
      
      if (matchedDog) {
        setMatchedDog(matchedDog);
        toast({
          title: 'Match Generated!',
          description: `Congratulations! You've been matched with ${matchedDog.name}.`,
        });
        navigate('/match');
      } else {
        toast({
          title: 'Match Error',
          description: 'Unable to find the matched dog in your favorites. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate a match. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingMatch(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Favorite Dogs</h1>
          <p className="text-muted-foreground mt-2">
            {favorites.length} {favorites.length === 1 ? 'dog' : 'dogs'} in your favorites
          </p>
        </div>
        <Button 
          onClick={handleGenerateMatch} 
          disabled={favorites.length === 0 || isGeneratingMatch}
          className="gap-2"
        >
          {isGeneratingMatch ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              Generate Match
            </>
          )}
        </Button>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 border rounded-lg">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You haven't added any dogs to your favorites yet. Browse dogs and click the heart icon to add them here.
          </p>
          <Button onClick={() => navigate('/search')}>
            Find Dogs
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
