import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Language } from "@/types";
import { ChevronLeft, ChevronRight, Trophy, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLanguageLevelsCount } from "@/data/languages";

interface LanguageCarouselProps {
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

export const LanguageCarousel = ({ languages, onLanguageSelect }: LanguageCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
    dragFree: false,
    slidesToScroll: 1,
    duration: 15,
  });

  const selectedLanguage = languages[selectedIndex] || languages[0];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const total = selectedLanguage ? getLanguageLevelsCount(selectedLanguage.id) : 0;
  const raw = selectedLanguage && total ? (selectedLanguage.completedLevels / total) * 100 : 0;
  const percent = Math.min(100, Math.max(0, Math.round(raw)));

  const handleLanguageClick = (language: Language, index: number) => {
    const isSelected = index === selectedIndex;
    
    if (emblaApi) {
      if (isSelected) {
        // Si l'élément est déjà sélectionné (au centre), déclencher l'action
        onLanguageSelect(language);
      } else {
        // Si l'élément n'est pas sélectionné (grisé), seulement le centrer
        emblaApi.scrollTo(index);
      }
    }
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Carousel Container */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-x">
            {languages.map((language, index) => {
              const isSelected = index === selectedIndex;
              const imagePath = `/${language.id}.png`;
              const distance = Math.abs(index - selectedIndex);
              const isAdjacent = distance === 1 || (selectedIndex === 0 && index === languages.length - 1) || (selectedIndex === languages.length - 1 && index === 0);
              
              return (
                <div
                  key={language.id}
                  className="flex-[0_0_280px] px-2"
                  onClick={() => handleLanguageClick(language, index)}
                >
                  <div
                    className={`transition-all duration-500 ease-out cursor-pointer ${
                      isSelected
                        ? "opacity-100 scale-100"
                        : isAdjacent
                        ? "opacity-50 scale-85 grayscale"
                        : "opacity-30 scale-70 grayscale blur-sm"
                    }`}
                  >
                    <Card
                      className={`h-[200px] md:h-[240px] overflow-hidden border-2 transition-all duration-500 rounded-xl ${
                        isSelected
                          ? "border-primary shadow-xl ring-2 ring-primary/30"
                          : "border-border/50 hover:opacity-80"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={imagePath}
                          alt={language.name}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end">
                            <div className="p-3 md:p-4 w-full">
                              <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                                {language.name}
                              </h3>
                              <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                                {language.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 bg-background/95 backdrop-blur-md hover:bg-background shadow-lg border-border/50 h-10 w-10 md:h-12 md:w-12"
          onClick={scrollPrev}
          aria-label="Langage précédent"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 bg-background/95 backdrop-blur-md hover:bg-background shadow-lg border-border/50 h-10 w-10 md:h-12 md:w-12"
          onClick={scrollNext}
          aria-label="Langage suivant"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </div>

      {/* Info Panel - Updates in real-time */}
      {selectedLanguage && (
        <Card className="p-4 md:p-6 bg-gradient-card border-border animate-fade-in">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Left: Stats */}
            <div className="space-y-3 md:space-y-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl">{selectedLanguage.icon}</span>
                  {selectedLanguage.name}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm">{selectedLanguage.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="text-center p-2 md:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-accent mx-auto mb-1" />
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {selectedLanguage.currentLevel}
                  </p>
                  <p className="text-xs text-muted-foreground">Niveau</p>
                </div>
                <div className="text-center p-2 md:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {selectedLanguage.completedLevels}/{total}
                  </p>
                  <p className="text-xs text-muted-foreground">Niveaux</p>
                </div>
                <div className="text-center p-2 md:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-accent mx-auto mb-1" />
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {selectedLanguage.earnedXP}
                  </p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            </div>

            {/* Right: Progress */}
            <div className="space-y-3 md:space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-medium text-foreground">Progression</span>
                  <span className="text-base md:text-lg font-bold text-foreground">
                    {selectedLanguage.earnedXP} / {selectedLanguage.totalXP} XP
                  </span>
                </div>
                <div className="xp-bar">
                  <div
                    className="xp-bar-fill transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{Math.round(percent)}% complété</span>
                  <span>{selectedLanguage.totalXP - selectedLanguage.earnedXP} XP restants</span>
                </div>
              </div>

              <Button
                onClick={() => onLanguageSelect(selectedLanguage)}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 text-sm md:text-base py-5 md:py-6"
                size="lg"
              >
                Commencer l'aventure
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 md:gap-2">
        {languages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (emblaApi) emblaApi.scrollTo(index);
            }}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-primary w-6 md:w-8"
                : "bg-muted w-1.5 md:w-2 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Aller au langage ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

