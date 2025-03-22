import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFavorite } from '@/contexts';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DogCard from '@/components/DogCard';
import { AlertTriangle, Heart, Loader2 } from 'lucide-react';
import { Dog } from '@/types';
import { useMatch } from '@/apis/dogs/useMatch';

const EmptyState = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-card">
    <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
    <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
    <p className="text-muted-foreground text-center max-w-md mb-6 px-4">
      You haven't added any dogs to your favorites yet. Browse dogs and click the heart icon to add them here.
    </p>
    <Button 
      onClick={onNavigate}
      className="gap-2"
    >
      <Heart className="h-4 w-4" />
      Find Dogs
    </Button>
  </div>
);

const FavoritesList = ({ dogs }: { dogs: Dog[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in">
    {dogs.map((dog) => (
      <DogCard 
        key={dog.id} 
        dog={dog}
        className="transform transition-all hover:scale-[1.02]"
      />
    ))}
  </div>
);

const FavoritesPage = () => {
  const { favorites, setMatchedDog } = useFavorite();
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutateAsync: generateMatch} = useMatch();

  const handleGenerateMatch = useCallback(async () => {
    if (favorites.length === 0) {
      toast({
        title: 'No favorites selected',
        description: 'Please add at least one dog to your favorites.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingMatch(true);

    try {
      
      const dogIds = favorites.map(dog => dog.id);
      const response = await generateMatch(dogIds);

      const matchedDog = favorites.find(dog => dog.id ===  response.match);
      
      if (!matchedDog) {
        throw new Error('Matched dog not found in favorites');
      }

      setMatchedDog(matchedDog);
      toast({
        title: 'Match Found! 🎉',
        description: `You've been matched with ${matchedDog.name}!`,
        duration: 5000,
      });
      navigate('/match');
    } catch (error) {
      console.error('Match error:', error);
      toast({
        title: 'Match Generation Failed',
        description: error instanceof Error 
          ? error.message 
          : 'Unable to generate a match. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingMatch(false);
    }
  }, [favorites, generateMatch, toast, navigate, setMatchedDog]);

  const navigateToSearch = useCallback(() => {
    navigate('/search');
  }, [navigate]);

  const favoriteCountMessage = favorites.length === 0
    ? 'You have no favorite dogs yet.'
    : `You have ${favorites.length} favorite dog${favorites.length > 1 ? 's' : ''}.`;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Your Favorite Dogs
          </h1>
          <p className="text-muted-foreground">
            {favoriteCountMessage}
          </p>
        </div>
        <Button 
          onClick={handleGenerateMatch} 
          disabled={favorites.length === 0 || isGeneratingMatch}
          className="w-full sm:w-auto gap-2"
          size="lg"
        >
          {(isGeneratingMatch) ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Match...
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
        <EmptyState onNavigate={navigateToSearch} />
      ) : (
        <FavoritesList dogs={favorites} />
      )}
    </div>
  );
};

export default FavoritesPage;
