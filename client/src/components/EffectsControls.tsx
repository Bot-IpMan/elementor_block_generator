import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlockConfigData } from "../../../drizzle/schema";

interface EffectsControlsProps {
  config: BlockConfigData;
  setConfig: (config: BlockConfigData) => void;
}

const SHADOW_PRESETS = [
  { label: "None", value: "none" },
  { label: "Small", value: "0 1px 2px rgba(0, 0, 0, 0.05)" },
  { label: "Medium", value: "0 4px 6px rgba(0, 0, 0, 0.1)" },
  { label: "Large", value: "0 10px 15px rgba(0, 0, 0, 0.1)" },
  { label: "Extra Large", value: "0 20px 25px rgba(0, 0, 0, 0.1)" },
  { label: "Custom", value: "custom" },
];

export default function EffectsControls({ config, setConfig }: EffectsControlsProps) {
  const handleEffectsChange = (key: keyof BlockConfigData["effects"], value: any) => {
    setConfig({
      ...config,
      effects: {
        ...config.effects,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="shadow">Shadow</Label>
        <Select
          value={
            SHADOW_PRESETS.find((p) => p.value === config.effects.shadow)?.value || "custom"
          }
          onValueChange={(value) => {
            if (value !== "custom") {
              handleEffectsChange("shadow", value);
            }
          }}
        >
          <SelectTrigger id="shadow">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SHADOW_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {config.effects.shadow &&
          !SHADOW_PRESETS.some((p) => p.value === config.effects.shadow) && (
            <Input
              type="text"
              value={config.effects.shadow}
              onChange={(e) => handleEffectsChange("shadow", e.target.value)}
              placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
              className="mt-2 text-xs"
            />
          )}
      </div>

      <div>
        <Label htmlFor="opacity">Opacity</Label>
        <div className="flex gap-2">
          <Input
            id="opacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.effects.opacity}
            onChange={(e) => handleEffectsChange("opacity", parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-semibold w-12 text-right">
            {Math.round(config.effects.opacity * 100)}%
          </span>
        </div>
      </div>

      <div>
        <Label htmlFor="borderWidth">Border Width (px)</Label>
        <Input
          id="borderWidth"
          type="number"
          value={config.effects.borderWidth}
          onChange={(e) => handleEffectsChange("borderWidth", parseInt(e.target.value) || 0)}
          min="0"
          max="10"
        />
      </div>
    </div>
  );
}
