import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { BlockConfigData, BlockItem } from "../../../drizzle/schema";

interface ContentEditorProps {
  config: BlockConfigData;
  setConfig: (config: BlockConfigData) => void;
}

const ICON_OPTIONS = [
  "check",
  "star",
  "heart",
  "arrow-right",
  "zap",
  "shield",
  "target",
  "users",
  "code",
  "settings",
  "bell",
  "mail",
  "phone",
  "map-pin",
  "calendar",
  "clock",
];

export default function ContentEditor({ config, setConfig }: ContentEditorProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setConfig({ ...config, title: value });
  };

  const handleSubtitleChange = (value: string) => {
    setConfig({ ...config, subtitle: value });
  };

  const handleDescriptionChange = (value: string) => {
    setConfig({ ...config, description: value });
  };

  const handleButtonTextChange = (value: string) => {
    if (config.content.button) {
      setConfig({
        ...config,
        content: {
          ...config.content,
          button: { ...config.content.button, text: value },
        },
      });
    }
  };

  const handleAddItem = () => {
    const newItem: BlockItem = {
      id: Date.now().toString(),
      type: "text",
      content: "New item",
      icon: "check",
    };
    setConfig({
      ...config,
      content: {
        ...config.content,
        items: [...config.content.items, newItem],
      },
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<BlockItem>) => {
    setConfig({
      ...config,
      content: {
        ...config.content,
        items: config.content.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    });
  };

  const handleDeleteItem = (id: string) => {
    setConfig({
      ...config,
      content: {
        ...config.content,
        items: config.content.items.filter((item) => item.id !== id),
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={config.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Block title"
        />
      </div>

      {/* Subtitle */}
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={config.subtitle || ""}
          onChange={(e) => handleSubtitleChange(e.target.value)}
          placeholder="Block subtitle"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={config.description || ""}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Block description"
          rows={3}
        />
      </div>

      {/* Button Text */}
      <div>
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={config.content.button?.text || ""}
          onChange={(e) => handleButtonTextChange(e.target.value)}
          placeholder="Button text"
        />
      </div>

      {/* List Items */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>List Items</Label>
          <Button size="sm" variant="outline" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {config.content.items.map((item) => (
            <div key={item.id} className="border border-border rounded p-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={item.content}
                  onChange={(e) => handleUpdateItem(item.id, { content: e.target.value })}
                  placeholder="Item text"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label htmlFor={`icon-${item.id}`} className="text-xs">
                  Icon
                </Label>
                <Select value={item.icon || "check"} onValueChange={(value) => handleUpdateItem(item.id, { icon: value })}>
                  <SelectTrigger id={`icon-${item.id}`} className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          <i className={`fas fa-${icon}`}></i>
                          {icon}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
