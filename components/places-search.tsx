"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, MapPin, Building2, Loader2 } from "lucide-react";

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
}

interface PlacesSearchProps {
  onSelect: (place: PlaceResult) => void;
}

export function PlacesSearch({ onSelect }: PlacesSearchProps) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function checkGoogle() {
      if (window.google?.maps?.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        setIsGoogleLoaded(true);
        return true;
      }
      return false;
    }

    if (checkGoogle()) return;

    const interval = setInterval(() => {
      if (checkGoogle()) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const searchPlaces = useCallback(
    (input: string) => {
      if (!input.trim() || !autocompleteService.current) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      autocompleteService.current.getPlacePredictions(
        {
          input,
          types: ["establishment"],
        },
        (results, status) => {
          setLoading(false);
          if (
            status === window.google!.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(results);
          } else {
            setPredictions([]);
          }
        }
      );
    },
    []
  );

  function handleInputChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 300);
  }

  function handleSelect(prediction: google.maps.places.AutocompletePrediction) {
    const name = prediction.structured_formatting.main_text;
    const address = prediction.structured_formatting.secondary_text || "";

    onSelect({
      placeId: prediction.place_id,
      name,
      address,
    });
    setQuery(name);
    setPredictions([]);
  }

  if (!isGoogleLoaded) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement de Google Places...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Recherchez le nom ou l'adresse de votre établissement..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {predictions.length > 0 && (
        <ul className="rounded-lg border border-border bg-white shadow-lg overflow-hidden divide-y divide-border/50">
          {predictions.map((prediction) => (
            <li key={prediction.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(prediction)}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                  "hover:bg-blue-50/60 focus:bg-blue-50/60 focus:outline-none"
                )}
              >
                <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {prediction.types?.includes("restaurant") ||
                  prediction.types?.includes("food") ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
