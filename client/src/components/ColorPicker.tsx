import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BlockConfigData } from "../../../drizzle/schema";

interface ColorPickerProps {
  config: BlockConfigData;
  setConfig: (config: BlockConfigData) => void;
}

export default function ColorPicker({ config, setConfig }: ColorPickerProps) {
  const handleColorChange = (key: keyof BlockConfigData["colors"], value: string) => {
    setConfig({
      ...config,
      colors: {
        ...config.colors,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bgColor">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="bgColor"
            type="color"
            value={config.colors.background}
            onChange={(e) => handleColorChange("background", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={config.colors.background}
            onChange={(e) => handleColorChange("background", e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="textPrimary">Primary Text Color</Label>
        <div className="flex gap-2">
          <Input
            id="textPrimary"
            type="color"
            value={config.colors.textPrimary}
            onChange={(e) => handleColorChange("textPrimary", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={config.colors.textPrimary}
            onChange={(e) => handleColorChange("textPrimary", e.target.value)}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="textSecondary">Secondary Text Color</Label>
        <div className="flex gap-2">
          <Input
            id="textSecondary"
            type="color"
            value={config.colors.textSecondary}
            onChange={(e) => handleColorChange("textSecondary", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={config.colors.textSecondary}
            onChange={(e) => handleColorChange("textSecondary", e.target.value)}
            placeholder="#B0BBC3"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="accentColor">Accent Color</Label>
        <div className="flex gap-2">
          <Input
            id="accentColor"
            type="color"
            value={config.colors.accentColor}
            onChange={(e) => handleColorChange("accentColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={config.colors.accentColor}
            onChange={(e) => handleColorChange("accentColor", e.target.value)}
            placeholder="#6366F1"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="borderColor">Border Color</Label>
        <div className="flex gap-2">
          <Input
            id="borderColor"
            type="color"
            value={config.colors.borderColor}
            onChange={(e) => handleColorChange("borderColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={config.colors.borderColor}
            onChange={(e) => handleColorChange("borderColor", e.target.value)}
            placeholder="#333333"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gradient">Gradient (Optional)</Label>
        <Input
          id="gradient"
          type="text"
          value={config.colors.backgroundGradient || ""}
          onChange={(e) =>
            handleColorChange("backgroundGradient", e.target.value || undefined as any)
          }
          placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          className="text-xs"
        />
      </div>
    </div>
  );
}
