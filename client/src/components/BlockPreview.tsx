import type { CSSProperties } from "react";
import type { BlockConfigData, TemplateType, BlockItem } from "../../../drizzle/schema";

interface BlockPreviewProps {
  config: BlockConfigData;
  templateType: TemplateType;
}

const stackClass = "flex flex-col gap-3";

const ItemIcon = ({ item, accent }: { item: BlockItem; accent: string }) => (
  <div
    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
    style={{
      background: `${accent}1a`,
      color: accent,
    }}
  >
    {item.icon ? item.icon.replace(/-/g, " ") : "•"}
  </div>
);

export default function BlockPreview({ config, templateType }: BlockPreviewProps) {
  const baseStyle: CSSProperties = {
    background: config.colors.backgroundGradient || config.colors.background,
    color: config.colors.textPrimary,
    padding: `${config.spacing.padding}px`,
    margin: `${config.spacing.margin}px`,
    borderRadius: `${config.spacing.borderRadius}px`,
    boxShadow: config.effects.shadow,
    opacity: config.effects.opacity,
    border: `${config.effects.borderWidth}px solid ${config.colors.borderColor}`,
    fontFamily: config.typography.fontFamily,
  };

  const titleStyle: CSSProperties = {
    fontSize: `${config.typography.titleSize}px`,
    marginBottom: `${config.spacing.gap}px`,
    lineHeight: config.typography.lineHeight,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: `${config.typography.subtitleSize}px`,
    marginBottom: `${config.spacing.gap}px`,
    color: config.colors.textSecondary,
  };

  const bodyStyle: CSSProperties = {
    fontSize: `${config.typography.bodySize}px`,
    lineHeight: config.typography.lineHeight,
    color: config.colors.textSecondary,
  };

  const buttonStyle: CSSProperties = {
    background: config.content.button?.backgroundColor ?? config.colors.accentColor,
    color: config.content.button?.color ?? "#fff",
    border: `${config.effects.borderWidth}px solid ${
      config.content.button?.borderColor ?? config.colors.accentColor
    }`,
    borderRadius: `${config.content.button?.borderRadius ?? config.spacing.borderRadius}px`,
    padding: `${config.content.button?.padding ?? 12}px ${config.spacing.padding}px`,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  };

  const renderList = (items: BlockItem[]) => (
    <ul className="space-y-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map(item => (
        <li key={item.id} className="flex items-start gap-3">
          <ItemIcon item={item} accent={config.colors.accentColor} />
          <div className={stackClass}>
            <span style={{ ...bodyStyle, color: config.colors.textPrimary }}>{item.content}</span>
            {item.children?.[0]?.content && (
              <span style={bodyStyle}>{item.children[0].content}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  const renderTemplate = () => {
    switch (templateType) {
      case "pricing_card":
        return (
          <div className={stackClass}>
            {config.title && <h2 style={titleStyle}>{config.title}</h2>}
            {config.subtitle && <p style={subtitleStyle}>{config.subtitle}</p>}
            {config.description && <p style={bodyStyle}>{config.description}</p>}
            {renderList(config.content.items)}
            {config.content.button && (
              <button style={buttonStyle}>{config.content.button.text}</button>
            )}
          </div>
        );
      case "feature_list":
        return (
          <div className={stackClass}>
            {config.title && <h2 style={titleStyle}>{config.title}</h2>}
            {renderList(config.content.items)}
          </div>
        );
      case "hero_section":
        return (
          <div className={`${stackClass} items-start`}>            
            {config.title && <h1 style={titleStyle}>{config.title}</h1>}
            {config.subtitle && <p style={subtitleStyle}>{config.subtitle}</p>}
            {config.description && <p style={bodyStyle}>{config.description}</p>}
            {config.content.button && (
              <button style={buttonStyle}>{config.content.button.text}</button>
            )}
          </div>
        );
      case "testimonial":
        return (
          <div className={stackClass}>
            {config.description && (
              <p style={{ ...bodyStyle, fontStyle: "italic", color: config.colors.textPrimary }}>
                “{config.description}”
              </p>
            )}
            {config.title && (
              <p style={{ ...bodyStyle, fontWeight: 600 }}>— {config.title}</p>
            )}
            {config.content.items[0]?.content && (
              <div style={{ ...bodyStyle, color: config.colors.accentColor }}>
                {config.content.items[0].content}
              </div>
            )}
          </div>
        );
      case "cta_section":
        return (
          <div className={`${stackClass} items-start`}>
            {config.title && <h2 style={titleStyle}>{config.title}</h2>}
            {config.subtitle && <p style={subtitleStyle}>{config.subtitle}</p>}
            {config.description && <p style={bodyStyle}>{config.description}</p>}
            {config.content.button && (
              <button style={buttonStyle}>{config.content.button.text}</button>
            )}
          </div>
        );
      case "team_member":
        return (
          <div className={stackClass}>
            {config.title && <h3 style={titleStyle}>{config.title}</h3>}
            {config.subtitle && <p style={subtitleStyle}>{config.subtitle}</p>}
            {config.description && <p style={bodyStyle}>{config.description}</p>}
          </div>
        );
      case "service_card":
        return (
          <div className={stackClass}>
            {config.content.items[0]?.icon && (
              <ItemIcon item={config.content.items[0]} accent={config.colors.accentColor} />
            )}
            {config.title && <h3 style={titleStyle}>{config.title}</h3>}
            {config.description && <p style={bodyStyle}>{config.description}</p>}
          </div>
        );
      case "custom":
      default:
        return (
          <div className={stackClass}>
            {config.title && <h2 style={titleStyle}>{config.title}</h2>}
            {config.description && <p style={bodyStyle}>{config.description}</p>}
            {renderList(config.content.items)}
          </div>
        );
    }
  };

  return (
    <div style={baseStyle} className="transition-all duration-200">
      {renderTemplate()}
    </div>
  );
}
