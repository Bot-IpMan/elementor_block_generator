import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlockConfigData } from "../../../drizzle/schema";

interface FontSelectorProps {
  config: BlockConfigData;
  setConfig: (config: BlockConfigData) => void;
}

const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Poppins",
  "Playfair Display",
  "Space Grotesk",
  "DM Sans",
  "Work Sans",
];

export default function FontSelector({ config, setConfig }: FontSelectorProps) {
  const handleTypographyChange = (key: keyof BlockConfigData["typography"], value: any) => {
    setConfig({
      ...config,
      typography: {
        ...config.typography,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select value={config.typography.fontFamily} onValueChange={(value) => handleTypographyChange("fontFamily", value)}>
          <SelectTrigger id="fontFamily">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="titleSize">Title Size (px)</Label>
        <Input
          id="titleSize"
          type="number"
          value={config.typography.titleSize}
          onChange={(e) => handleTypographyChange("titleSize", parseInt(e.target.value) || 32)}
          min="12"
          max="72"
        />
      </div>

      <div>
        <Label htmlFor="subtitleSize">Subtitle Size (px)</Label>
        <Input
          id="subtitleSize"
          type="number"
          value={config.typography.subtitleSize}
          onChange={(e) => handleTypographyChange("subtitleSize", parseInt(e.target.value) || 20)}
          min="12"
          max="48"
        />
      </div>

      <div>
        <Label htmlFor="bodySize">Body Size (px)</Label>
        <Input
          id="bodySize"
          type="number"
          value={config.typography.bodySize}
          onChange={(e) => handleTypographyChange("bodySize", parseInt(e.target.value) || 16)}
          min="12"
          max="32"
        />
      </div>

      <div>
        <Label htmlFor="lineHeight">Line Height</Label>
        <Input
          id="lineHeight"
          type="number"
          step="0.1"
          value={config.typography.lineHeight}
          onChange={(e) => handleTypographyChange("lineHeight", parseFloat(e.target.value) || 1.5)}
          min="1"
          max="3"
        />
      </div>
    </div>
  );
}
