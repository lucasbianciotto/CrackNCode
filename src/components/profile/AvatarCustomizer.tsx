import { useState, useEffect } from "react";
import { Avataaars } from "@/components/ui/Avataaars";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const HAIR_TYPES = [
  "NoHair", "Eyepatch", "Hat", "Hijab", "Turban", "WinterHat1", "WinterHat2", "WinterHat3", "WinterHat4",
  "LongHairBigHair", "LongHairBob", "LongHairBun", "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro", "LongHairFroBand", "LongHairNotTooLong", "LongHairShavedSides", "LongHairMiaWallace", "LongHairStraight", "LongHairStraight2", "LongHairStraightStrand",
  "ShortHairDreads01", "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShaggyMullet", "ShortHairShortCurly", "ShortHairShortFlat", "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides", "ShortHairTheCaesar", "ShortHairTheCaesarSidePart"
];
const ACCESSORIES = [
  "Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses", "Wayfarers"
];
const HAT_COLORS = [
  "Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather", "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow", "Pink", "Red", "White"
];
const HAIR_COLORS = [
  "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink", "Blue", "Platinum", "Red", "SilverGray"
];
const FACIAL_HAIR_TYPES = [
  "Blank", "BeardMedium", "BeardLight", "BeardMajestic", "MoustacheFancy", "MoustacheMagnum"
];
const FACIAL_HAIR_COLORS = [
  "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "Platinum", "Red", "SilverGray"
];
const CLOTHES = [
  "BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall", "ShirtCrewNeck", "ShirtScoopNeck", "ShirtVNeck"
];
const CLOTHES_COLORS = [
  "Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather", "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow", "Pink", "Red", "White"
];
const GRAPHICS = [
  "Bat", "Cumbia", "Deer", "Diamond", "Hola", "Pizza", "Resist", "Selena", "Bear", "Skull", "SkullOutline"
];
const EYES = [
  "Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy", "Hearts", "Side", "Squint", "Surprised", "Wink", "WinkWacky"
];
const EYEBROWS = [
  "Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural", "RaisedExcited", "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural", "UnibrowNatural", "UpDown", "UpDownNatural"
];
const MOUTHS = [
  "Concerned", "Default", "Disbelief", "Eating", "Grimace", "Sad", "ScreamOpen", "Serious", "Smile", "Tongue", "Twinkle", "Vomit"
];
const SKIN_COLORS = [
  "Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black"
];

// Utilitaires pour transformer les valeurs en labels lisibles en français
const LABELS_FR: Record<string, string> = {
  // Styles
  Circle: "Cercle",
  Transparent: "Transparent",
  // Cheveux/Chapeaux
  NoHair: "Sans cheveux",
  Eyepatch: "Cache-œil",
  Hat: "Chapeau",
  Hijab: "Hijab",
  Turban: "Turban",
  WinterHat1: "Bonnet d'hiver 1",
  WinterHat2: "Bonnet d'hiver 2",
  WinterHat3: "Bonnet d'hiver 3",
  WinterHat4: "Bonnet d'hiver 4",
  LongHairBigHair: "Longs cheveux volumineux",
  LongHairBob: "Carré long",
  LongHairBun: "Chignon long",
  LongHairCurly: "Longs cheveux bouclés",
  LongHairCurvy: "Longs cheveux ondulés",
  LongHairDreads: "Longues dreadlocks",
  LongHairFrida: "Frida Kahlo",
  LongHairFro: "Afro long",
  LongHairFroBand: "Afro avec bandeau",
  LongHairNotTooLong: "Longs cheveux mi-longs",
  LongHairShavedSides: "Longs cheveux côtés rasés",
  LongHairMiaWallace: "Mia Wallace",
  LongHairStraight: "Longs cheveux lisses",
  LongHairStraight2: "Longs cheveux lisses 2",
  LongHairStraightStrand: "Longue mèche lisse",
  ShortHairDreads01: "Courtes dreadlocks 1",
  ShortHairDreads02: "Courtes dreadlocks 2",
  ShortHairFrizzle: "Cheveux crépus courts",
  ShortHairShaggyMullet: "Mulet court",
  ShortHairShortCurly: "Cheveux courts bouclés",
  ShortHairShortFlat: "Cheveux courts plats",
  ShortHairShortRound: "Cheveux courts ronds",
  ShortHairShortWaved: "Cheveux courts ondulés",
  ShortHairSides: "Cheveux courts côtés",
  ShortHairTheCaesar: "César court",
  ShortHairTheCaesarSidePart: "César court côté",
  // Accessoires
  Blank: "Aucun",
  Kurt: "Lunettes Kurt",
  Prescription01: "Lunettes de vue 1",
  Prescription02: "Lunettes de vue 2",
  Round: "Lunettes rondes",
  Sunglasses: "Lunettes de soleil",
  Wayfarers: "Wayfarers",
  // Couleurs chapeau/cheveux/barbe/vêtements
  Black: "Noir",
  Blue01: "Bleu clair",
  Blue02: "Bleu moyen",
  Blue03: "Bleu foncé",
  Gray01: "Gris clair",
  Gray02: "Gris foncé",
  Heather: "Gris chiné",
  PastelBlue: "Bleu pastel",
  PastelGreen: "Vert pastel",
  PastelOrange: "Orange pastel",
  PastelRed: "Rouge pastel",
  PastelYellow: "Jaune pastel",
  Pink: "Rose",
  Red: "Rouge",
  White: "Blanc",
  Auburn: "Auburn",
  Blonde: "Blond",
  BlondeGolden: "Blond doré",
  Brown: "Châtain",
  BrownDark: "Châtain foncé",
  PastelPink: "Rose pastel",
  Platinum: "Platine",
  SilverGray: "Gris argenté",
  // Barbe/moustache
  BeardMedium: "Barbe moyenne",
  BeardLight: "Barbe légère",
  BeardMajestic: "Barbe majestueuse",
  MoustacheFancy: "Moustache stylée",
  MoustacheMagnum: "Moustache Magnum",
  // Vêtements
  BlazerShirt: "Blazer + chemise",
  BlazerSweater: "Blazer + pull",
  CollarSweater: "Pull col roulé",
  GraphicShirt: "T-shirt graphique",
  Hoodie: "Sweat à capuche",
  Overall: "Salopette",
  ShirtCrewNeck: "T-shirt col rond",
  ShirtScoopNeck: "T-shirt col échancré",
  ShirtVNeck: "T-shirt col V",
  // Motifs
  Bat: "Chauve-souris",
  Cumbia: "Cumbia",
  Deer: "Cerf",
  Diamond: "Diamant",
  Hola: "Hola",
  Pizza: "Pizza",
  Resist: "Resist",
  Selena: "Selena",
  Bear: "Ours",
  Skull: "Crâne",
  SkullOutline: "Crâne (contour)",
  // Yeux
  Close: "Fermés",
  Cry: "Larmes",
  Default: "Normaux",
  Dizzy: "Étourdis",
  EyeRoll: "Yeux levés",
  Happy: "Heureux",
  Hearts: "Cœurs",
  Side: "De côté",
  Squint: "Plissés",
  Surprised: "Surpris",
  Wink: "Clin d'œil",
  WinkWacky: "Clin d'œil fou",
  // Sourcils
  Angry: "En colère",
  AngryNatural: "En colère (naturel)",
  DefaultNatural: "Normaux (naturel)",
  FlatNatural: "Plats (naturel)",
  RaisedExcited: "Sourcils levés",
  RaisedExcitedNatural: "Sourcils levés (naturel)",
  SadConcerned: "Tristes/inquiets",
  SadConcernedNatural: "Tristes/inquiets (naturel)",
  UnibrowNatural: "Mono-sourcil",
  UpDown: "Haut/Bas",
  UpDownNatural: "Haut/Bas (naturel)",
  // Bouches
  Concerned: "Inquiet",
  Disbelief: "Incrédule",
  Eating: "Mange",
  Grimace: "Grimace",
  Sad: "Triste",
  ScreamOpen: "Cris ouvert",
  Serious: "Sérieux",
  Smile: "Sourire",
  Tongue: "Langue tirée",
  Twinkle: "Clin d'œil étoile",
  Vomit: "Vomi",
  // Peau
  Tanned: "Hâlé",
  Yellow: "Jaune",
  Pale: "Pâle",
  Light: "Clair",
  DarkBrown: "Marron foncé",
};

function labelFr(key: string) {
  return LABELS_FR[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

export type AvatarOptions = {
  avatarStyle: string;
  topType: string;
  accessoriesType: string;
  hatColor: string;
  hairColor: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  graphicType: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
};

const defaultOptions: AvatarOptions = {
  avatarStyle: "Circle",
  topType: "ShortHairShortFlat",
  accessoriesType: "Blank",
  hatColor: "Black",
  hairColor: "Brown",
  facialHairType: "Blank",
  facialHairColor: "Brown",
  clotheType: "Hoodie",
  clotheColor: "Blue03",
  graphicType: "Bat",
  eyeType: "Default",
  eyebrowType: "Default",
  mouthType: "Smile",
  skinColor: "Light",
};

export function AvatarCustomizer({ 
  onChange,
  initialOptions 
}: { 
  onChange: (opts: AvatarOptions) => void;
  initialOptions?: AvatarOptions | null;
}) {
  const [options, setOptions] = useState<AvatarOptions>(initialOptions || defaultOptions);

  // Mettre à jour les options quand initialOptions change
  useEffect(() => {
    if (initialOptions) {
      setOptions(initialOptions);
    }
  }, [initialOptions]);

  function handleChange(key: keyof AvatarOptions, value: string) {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onChange(newOptions);
  }

  // Afficher le motif uniquement si GraphicShirt est sélectionné
  const showGraphicType = options.clotheType === "GraphicShirt";
  // Afficher la couleur du chapeau uniquement si un topType qui est un chapeau est sélectionné
  const hatTypes = ["Hat", "Hijab", "Turban", "WinterHat1", "WinterHat2", "WinterHat3", "WinterHat4"];
  const showHatColor = hatTypes.includes(options.topType);
  // Afficher la couleur des cheveux uniquement si ce n'est pas un chapeau ou "NoHair"
  const showHairColor = !hatTypes.includes(options.topType) && options.topType !== "NoHair";
  // Afficher la couleur de la barbe uniquement si une barbe est sélectionnée
  const showFacialHairColor = options.facialHairType && options.facialHairType !== "Blank";

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full max-w-full">
      {/* Aperçu de l'avatar */}
      <div className="w-full md:w-auto flex-shrink-0">
        <div className="w-40 h-40 md:w-48 md:h-48 mx-auto md:mx-0 rounded-full bg-gradient-primary p-2 flex items-center justify-center shadow-lg">
          <Avataaars {...options} avatarStyle="Circle" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      
      {/* Contrôles de personnalisation */}
      <div className="flex-1 w-full min-w-0">
        <Tabs defaultValue="visage" className="w-full">
        <TabsList className="mb-4 flex flex-wrap justify-center md:justify-start">
          <TabsTrigger value="visage">Visage</TabsTrigger>
          <TabsTrigger value="cheveux">Cheveux</TabsTrigger>
          <TabsTrigger value="accessoires">Accessoires</TabsTrigger>
          <TabsTrigger value="vetements">Vêtements</TabsTrigger>
        </TabsList>
        <TabsContent value="visage" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Yeux</label>
              <Select value={options.eyeType} onValueChange={v => handleChange("eyeType", v)}>
                <SelectTrigger><SelectValue placeholder="Yeux" /></SelectTrigger>
                <SelectContent>
                  {EYES.map(e => <SelectItem key={e} value={e}>{labelFr(e)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Sourcils</label>
              <Select value={options.eyebrowType} onValueChange={v => handleChange("eyebrowType", v)}>
                <SelectTrigger><SelectValue placeholder="Sourcils" /></SelectTrigger>
                <SelectContent>
                  {EYEBROWS.map(e => <SelectItem key={e} value={e}>{labelFr(e)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Bouche</label>
              <Select value={options.mouthType} onValueChange={v => handleChange("mouthType", v)}>
                <SelectTrigger><SelectValue placeholder="Bouche" /></SelectTrigger>
                <SelectContent>
                  {MOUTHS.map(m => <SelectItem key={m} value={m}>{labelFr(m)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Couleur peau</label>
              <Select value={options.skinColor} onValueChange={v => handleChange("skinColor", v)}>
                <SelectTrigger><SelectValue placeholder="Peau" /></SelectTrigger>
                <SelectContent>
                  {SKIN_COLORS.map(s => <SelectItem key={s} value={s}>{labelFr(s)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="cheveux" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Cheveux / Chapeau</label>
              <Select value={options.topType} onValueChange={v => handleChange("topType", v)}>
                <SelectTrigger><SelectValue placeholder="Cheveux" /></SelectTrigger>
                <SelectContent>
                  {HAIR_TYPES.map(h => <SelectItem key={h} value={h}>{labelFr(h)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {showHatColor && (
              <div>
                <label className="block mb-1 text-sm font-medium">Couleur du chapeau</label>
                <Select value={options.hatColor} onValueChange={v => handleChange("hatColor", v)}>
                  <SelectTrigger><SelectValue placeholder="Couleur chapeau" /></SelectTrigger>
                  <SelectContent>
                    {HAT_COLORS.map(c => <SelectItem key={c} value={c}>{labelFr(c)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {showHairColor && (
              <div>
                <label className="block mb-1 text-sm font-medium">Couleur des cheveux</label>
                <Select value={options.hairColor} onValueChange={v => handleChange("hairColor", v)}>
                  <SelectTrigger><SelectValue placeholder="Couleur cheveux" /></SelectTrigger>
                  <SelectContent>
                    {HAIR_COLORS.map(c => <SelectItem key={c} value={c}>{labelFr(c)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="accessoires" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Accessoires</label>
              <Select value={options.accessoriesType} onValueChange={v => handleChange("accessoriesType", v)}>
                <SelectTrigger><SelectValue placeholder="Accessoires" /></SelectTrigger>
                <SelectContent>
                  {ACCESSORIES.map(a => <SelectItem key={a} value={a}>{labelFr(a)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Barbe / Moustache</label>
              <Select value={options.facialHairType} onValueChange={v => handleChange("facialHairType", v)}>
                <SelectTrigger><SelectValue placeholder="Barbe" /></SelectTrigger>
                <SelectContent>
                  {FACIAL_HAIR_TYPES.map(f => <SelectItem key={f} value={f}>{labelFr(f)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {showFacialHairColor && (
              <div>
                <label className="block mb-1 text-sm font-medium">Couleur barbe</label>
                <Select value={options.facialHairColor} onValueChange={v => handleChange("facialHairColor", v)}>
                  <SelectTrigger><SelectValue placeholder="Couleur barbe" /></SelectTrigger>
                  <SelectContent>
                    {FACIAL_HAIR_COLORS.map(c => <SelectItem key={c} value={c}>{labelFr(c)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="vetements" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Vêtements</label>
              <Select value={options.clotheType} onValueChange={v => handleChange("clotheType", v)}>
                <SelectTrigger><SelectValue placeholder="Vêtements" /></SelectTrigger>
                <SelectContent>
                  {CLOTHES.map(c => <SelectItem key={c} value={c}>{labelFr(c)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Couleur vêtements</label>
              <Select value={options.clotheColor} onValueChange={v => handleChange("clotheColor", v)}>
                <SelectTrigger><SelectValue placeholder="Couleur vêtements" /></SelectTrigger>
                <SelectContent>
                  {CLOTHES_COLORS.map(c => <SelectItem key={c} value={c}>{labelFr(c)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {showGraphicType && (
              <div>
                <label className="block mb-1 text-sm font-medium">Motif T-shirt</label>
                <Select value={options.graphicType} onValueChange={v => handleChange("graphicType", v)}>
                  <SelectTrigger><SelectValue placeholder="Motif" /></SelectTrigger>
                  <SelectContent>
                    {GRAPHICS.map(g => <SelectItem key={g} value={g}>{labelFr(g)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
