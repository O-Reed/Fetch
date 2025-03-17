import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorite } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBreedName, getAgeText, formatZipCode } from '@/lib/utils';
import { ArrowLeft, Heart, Search } from 'lucide-react';
import confetti from 'canvas-confetti';

const MatchPage = () => {
  const { matchedDog, clearFavorites } = useFavorite();
  const navigate = useNavigate();

  // Trigger confetti effect on component mount
  useEffect(() => {
    if (matchedDog) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [matchedDog]);

  // If no matched dog, redirect to favorites
  useEffect(() => {
    if (!matchedDog) {
      navigate('/favorites');
    }
  }, [matchedDog, navigate]);

  if (!matchedDog) {
    return null;
  }

  const handleStartOver = () => {
    clearFavorites();
    navigate('/search');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Congratulations!</CardTitle>
          <CardDescription className="text-lg">
            You've been matched with {matchedDog.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="rounded-lg overflow-hidden h-80 mb-4">
                <img 
                  src={matchedDog.img} 
                  alt={`${matchedDog.name} - ${matchedDog.breed}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?q=80&w=500';
                  }}
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">About {matchedDog.name}</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{getAgeText(matchedDog.age)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Breed:</span>
                    <span className="font-medium">{formatBreedName(matchedDog.breed)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">Zip Code {formatZipCode(matchedDog.zip_code)}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What's Next?</h4>
                <p className="text-sm text-muted-foreground">
                  Contact your local shelter with this dog's ID ({matchedDog.id.substring(0, 8)}...) 
                  to start the adoption process for {matchedDog.name}. Every dog deserves a loving home!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/favorites')}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Favorites
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/search')}
              className="gap-2 flex-1"
            >
              <Search className="h-4 w-4" />
              Continue Browsing
            </Button>
            <Button 
              onClick={handleStartOver}
              className="gap-2 flex-1"
            >
              <Heart className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MatchPage;
