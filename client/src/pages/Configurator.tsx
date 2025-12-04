import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ColorPicker from "@/components/ColorPicker";
import FontSelector from "@/components/FontSelector";
import ContentEditor from "@/components/ContentEditor";
import SpacingControls from "@/components/SpacingControls";
import EffectsControls from "@/components/EffectsControls";
import BlockPreview from "@/components/BlockPreview";
import type { BlockConfigData, TemplateType } from "../../../drizzle/schema";

const TEMPLATE_TYPES = [
  { value: "pricing_card", label: "Pricing Card" },
  { value: "feature_list", label: "Feature List" },
  { value: "hero_section", label: "Hero Section" },
  { value: "testimonial", label: "Testimonial" },
  { value: "cta_section", label: "CTA Section" },
  { value: "team_member", label: "Team Member" },
  { value: "service_card", label: "Service Card" },
  { value: "custom", label: "Custom" },
];

const DEFAULT_CONFIG: BlockConfigData = {
  title: "Your Title Here",
  subtitle: "Subtitle",
  description: "Add your description here",
  colors: {
    background: "#0F111A",
    backgroundGradient: undefined,
    textPrimary: "#FFFFFF",
    textSecondary: "#B0BBC3",
    accentColor: "#6366F1",
    borderColor: "#333333",
  },
  typography: {
    fontFamily: "Inter",
    titleSize: 32,
    subtitleSize: 20,
    bodySize: 16,
    lineHeight: 1.5,
  },
  spacing: {
    padding: 24,
    margin: 16,
    borderRadius: 8,
    gap: 12,
  },
  effects: {
    shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    opacity: 1,
    borderWidth: 1,
  },
  content: {
    items: [
      { id: "1", type: "text", content: "Feature 1", icon: "check" },
      { id: "2", type: "text", content: "Feature 2", icon: "check" },
      { id: "3", type: "text", content: "Feature 3", icon: "check" },
    ],
    button: {
      text: "Get Started",
      color: "#FFFFFF",
      backgroundColor: "#6366F1",
      borderColor: "#6366F1",
      borderRadius: 8,
      padding: 12,
    },
  },
  responsive: {
    mobileView: true,
    tabletView: true,
    desktopView: true,
  },
};

export default function Configurator() {
  const [blockName, setBlockName] = useState("My Block");
  const [templateType, setTemplateType] = useState<TemplateType>("pricing_card");
  const [config, setConfig] = useState<BlockConfigData>(DEFAULT_CONFIG);
  const [generatedCode, setGeneratedCode] = useState<{ html: string; css: string } | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const generateCodeMutation = trpc.blocks.generateCode.useQuery({
    config,
    templateType,
  });

  const createBlockMutation = trpc.blocks.create.useMutation({
    onSuccess: () => {
      toast.success("Block saved successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save block");
    },
  });

  // Update generated code when config changes
  useEffect(() => {
    if (generateCodeMutation.data) {
      setGeneratedCode(generateCodeMutation.data);
    }
  }, [generateCodeMutation.data]);

  const handleSaveBlock = async () => {
    try {
      await createBlockMutation.mutateAsync({
        name: blockName,
        templateType: templateType as any,
        config: config as any,
        generatedHtml: generatedCode?.html,
        generatedCss: generatedCode?.css,
      });
    } catch (error) {
      console.error("Failed to save block:", error);
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;

    const fullCode = `<style>${generatedCode.css}</style>\n${generatedCode.html}`;
    navigator.clipboard.writeText(fullCode);
    toast.success("Code copied to clipboard!");
  };

  const handleDownloadCode = () => {
    if (!generatedCode) return;

    const fullCode = `<style>${generatedCode.css}</style>\n${generatedCode.html}`;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(fullCode));
    element.setAttribute("download", `${blockName.replace(/\s+/g, "-").toLowerCase()}.html`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Code downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Block Generator</h1>
          <p className="text-muted-foreground">Create beautiful, customizable HTML blocks for Elementor</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurator Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Block Name */}
                <div>
                  <Label htmlFor="blockName">Block Name</Label>
                  <Input
                    id="blockName"
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    placeholder="Enter block name"
                  />
                </div>

                {/* Template Type */}
                <div>
                  <Label htmlFor="templateType">Template Type</Label>
                  <Select value={templateType} onValueChange={(value) => setTemplateType(value as TemplateType)}>
                    <SelectTrigger id="templateType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_TYPES.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabs for different settings */}
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="typography">Type</TabsTrigger>
                    <TabsTrigger value="spacing">Space</TabsTrigger>
                  </TabsList>

                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-4">
                    <ContentEditor config={config} setConfig={setConfig} />
                  </TabsContent>

                  {/* Colors Tab */}
                  <TabsContent value="colors" className="space-y-4">
                    <ColorPicker config={config} setConfig={setConfig} />
                  </TabsContent>

                  {/* Typography Tab */}
                  <TabsContent value="typography" className="space-y-4">
                    <FontSelector config={config} setConfig={setConfig} />
                  </TabsContent>

                  {/* Spacing Tab */}
                  <TabsContent value="spacing" className="space-y-4">
                    <SpacingControls config={config} setConfig={setConfig} />
                    <EffectsControls config={config} setConfig={setConfig} />
                  </TabsContent>
                </Tabs>

                {/* Save Button */}
                <Button
                  onClick={handleSaveBlock}
                  disabled={createBlockMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createBlockMutation.isPending ? "Saving..." : "Save Block"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Preview and Code Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Preview */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Live Preview</h2>
              <div className="bg-muted p-6 rounded-lg border border-border min-h-[400px] overflow-auto">
                <BlockPreview config={config} templateType={templateType} />
              </div>
            </Card>

            {/* Code Output */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Generated Code</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    disabled={!generatedCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCode}
                    disabled={!generatedCode}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {generatedCode ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">HTML</Label>
                    <pre className="bg-muted p-4 rounded border border-border text-xs overflow-x-auto max-h-[150px]">
                      <code>{generatedCode.html}</code>
                    </pre>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">CSS</Label>
                    <pre className="bg-muted p-4 rounded border border-border text-xs overflow-x-auto max-h-[150px]">
                      <code>{generatedCode.css}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading code...</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
