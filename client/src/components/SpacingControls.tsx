import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BlockConfigData } from "../../../drizzle/schema";

interface SpacingControlsProps {
  config: BlockConfigData;
  setConfig: (config: BlockConfigData) => void;
}

export default function SpacingControls({ config, setConfig }: SpacingControlsProps) {
  const handleSpacingChange = (key: keyof BlockConfigData["spacing"], value: number) => {
    setConfig({
      ...config,
      spacing: {
        ...config.spacing,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="padding">Padding (px)</Label>
        <Input
          id="padding"
          type="number"
          value={config.spacing.padding}
          onChange={(e) => handleSpacingChange("padding", parseInt(e.target.value) || 0)}
          min="0"
          max="100"
        />
      </div>

      <div>
        <Label htmlFor="margin">Margin (px)</Label>
        <Input
          id="margin"
          type="number"
          value={config.spacing.margin}
          onChange={(e) => handleSpacingChange("margin", parseInt(e.target.value) || 0)}
          min="0"
          max="100"
        />
      </div>

      <div>
        <Label htmlFor="borderRadius">Border Radius (px)</Label>
        <Input
          id="borderRadius"
          type="number"
          value={config.spacing.borderRadius}
          onChange={(e) => handleSpacingChange("borderRadius", parseInt(e.target.value) || 0)}
          min="0"
          max="50"
        />
      </div>

      <div>
        <Label htmlFor="gap">Gap (px)</Label>
        <Input
          id="gap"
          type="number"
          value={config.spacing.gap}
          onChange={(e) => handleSpacingChange("gap", parseInt(e.target.value) || 0)}
          min="0"
          max="50"
        />
      </div>
    </div>
  );
}
