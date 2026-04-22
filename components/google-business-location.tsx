"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { useTranslations } from "next-intl";

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
}

type Props = {
  className?: string;
};

function getGoogle(): Record<string, unknown> | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { google?: Record<string, unknown> };
  return w.google;
}

export function GoogleBusinessLocation({ className }: Props) {
  const t = useTranslations("GoogleBusinessLocation");
  const establishment = useCartStore((s) => s.establishment);
  const setEstablishment = useCartStore((s) => s.setEstablishment);

  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasSelectedPlace =
    Boolean(establishment.placeId) && !establishment.useCustomName;

  useEffect(() => {
    if (establishment.useCustomName) return;
    if (establishment.placeId && establishment.businessName) {
      setSearchQuery(establishment.businessName);
    }
  }, [
    establishment.placeId,
    establishment.businessName,
    establishment.useCustomName,
  ]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setPlaces([]);
      return;
    }

    const g = getGoogle();
    if (!g) return;

    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true);
      const request = {
        query: searchQuery,
        type: "establishment" as const,
        fields: ["place_id", "name", "formatted_address"],
      };

      const maps = g.maps as {
        places: {
          PlacesService: new (el: HTMLDivElement) => {
            textSearch: (
              req: typeof request,
              cb: (
                results: Array<{
                  place_id?: string;
                  name?: string;
                  formatted_address?: string;
                }> | null,
                status: string
              ) => void
            ) => void;
          };
          PlacesServiceStatus: { OK: string };
        };
      };

      const placesService = new maps.places.PlacesService(
        document.createElement("div")
      );

      placesService.textSearch(request, (results, status) => {
        setIsSearching(false);
        if (status === maps.places.PlacesServiceStatus.OK && results) {
          setPlaces(
            results.slice(0, 5).map((result) => ({
              place_id: result.place_id!,
              name: result.name!,
              formatted_address: result.formatted_address ?? "",
            }))
          );
        } else {
          setPlaces([]);
        }
      });
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handlePlaceSelect = (place: PlaceResult) => {
    setEstablishment({
      placeId: place.place_id,
      businessName: place.name,
      address: place.formatted_address,
      useCustomName: false,
    });
    setSearchQuery(place.name);
    setPlaces([]);
  };

  const clearPlace = () => {
    setEstablishment({
      placeId: null,
      businessName: "",
      address: "",
      useCustomName: false,
    });
    setSearchQuery("");
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            {t("title")}
          </h3>
          <p className="text-sm text-muted-foreground">{t("desc")}</p>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("placeholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (hasSelectedPlace) {
                setEstablishment({
                  placeId: null,
                  businessName: "",
                  address: "",
                  useCustomName: false,
                });
              }
            }}
            className="pl-9"
            disabled={establishment.useCustomName}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {places.length > 0 &&
          !hasSelectedPlace &&
          !establishment.useCustomName && (
            <div className="relative z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {places.map((place) => (
                <button
                  key={place.place_id}
                  type="button"
                  onClick={() => handlePlaceSelect(place)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="font-medium">{place.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {place.formatted_address}
                  </div>
                </button>
              ))}
            </div>
          )}

        {hasSelectedPlace && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-green-900">
                  {establishment.businessName}
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {establishment.address}
                </div>
              </div>
              <button
                type="button"
                onClick={clearPlace}
                className="text-green-700 hover:text-green-900 text-sm font-medium shrink-0"
              >
                {t("change")}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={establishment.useCustomName}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  setEstablishment({
                    useCustomName: true,
                    placeId: null,
                    address: "",
                    businessName: "",
                  });
                  setSearchQuery("");
                  setPlaces([]);
                } else {
                  setEstablishment({ useCustomName: false });
                }
              }}
              className="rounded"
            />
            <span className="text-sm text-muted-foreground">
              {t("custom_label")}
            </span>
          </label>
          {establishment.useCustomName && (
            <Input
              type="text"
              placeholder={t("custom_placeholder")}
              value={establishment.businessName}
              onChange={(e) =>
                setEstablishment({ businessName: e.target.value })
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
