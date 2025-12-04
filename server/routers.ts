import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createBlockConfig, updateBlockConfig, getBlockConfigById, getUserBlockConfigs, deleteBlockConfig } from "./db";
import { BlockConfigData } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

// Block configuration schema for validation
const blockConfigSchema = z.object({
  name: z.string().min(1, "Block name is required"),
  description: z.string().optional(),
  templateType: z.union([z.literal("pricing_card"), z.literal("feature_list"), z.literal("hero_section"), z.literal("testimonial"), z.literal("cta_section"), z.literal("team_member"), z.literal("service_card"), z.literal("custom")]),
  config: z.record(z.string(), z.any()),
  generatedHtml: z.string().optional(),
  generatedCss: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  blocks: router({
    // Create a new block configuration
    create: protectedProcedure
      .input(blockConfigSchema)
      .mutation(async ({ input, ctx }) => {
        const config = await createBlockConfig({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          templateType: input.templateType,
          config: input.config as any,
          generatedHtml: input.generatedHtml,
          generatedCss: input.generatedCss,
        });

        if (!config) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create block configuration",
          });
        }

        return config;
      }),

    // Update an existing block configuration
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: blockConfigSchema.partial().strict(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verify ownership
        const existing = await getBlockConfigById(input.id);
        if (!existing || existing.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to update this block",
          });
        }

        const updated = await updateBlockConfig(input.id, {
          name: input.data.name,
          description: input.data.description,
          templateType: input.data.templateType,
          config: input.data.config as any,
          generatedHtml: input.data.generatedHtml,
          generatedCss: input.data.generatedCss,
        });

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update block configuration",
          });
        }

        return updated;
      }),

    // Get a single block configuration
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const config = await getBlockConfigById(input.id);

        if (!config || config.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Block configuration not found",
          });
        }

        return config;
      }),

    // Get all blocks for the current user
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await getUserBlockConfigs(ctx.user.id);
      }),

    // Delete a block configuration
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Verify ownership
        const existing = await getBlockConfigById(input.id);
        if (!existing || existing.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this block",
          });
        }

        const success = await deleteBlockConfig(input.id);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete block configuration",
          });
        }

        return { success: true };
      }),

    // Generate HTML/CSS from block configuration
    generateCode: publicProcedure
      .input(z.object({
        config: z.record(z.string(), z.any()),
        templateType: z.string(),
      }))
      .query(async ({ input }) => {
        const { html, css } = generateBlockCode(input.config as unknown as BlockConfigData, input.templateType);
        return { html, css };
      }),
  }),
});

/**
 * Generate clean, minified HTML and CSS from block configuration
 */
function generateBlockCode(config: BlockConfigData, templateType: string): { html: string; css: string } {
  // Generate unique class name based on timestamp
  const blockId = `block-${Date.now()}`;

  // Generate CSS
  const css = generateCSS(blockId, config);

  // Generate HTML based on template type
  let html = "";
  
  switch (templateType) {
    case "pricing_card":
      html = generatePricingCardHTML(blockId, config);
      break;
    case "feature_list":
      html = generateFeatureListHTML(blockId, config);
      break;
    case "hero_section":
      html = generateHeroSectionHTML(blockId, config);
      break;
    case "testimonial":
      html = generateTestimonialHTML(blockId, config);
      break;
    case "cta_section":
      html = generateCTASectionHTML(blockId, config);
      break;
    case "team_member":
      html = generateTeamMemberHTML(blockId, config);
      break;
    case "service_card":
      html = generateServiceCardHTML(blockId, config);
      break;
    default:
      html = generateCustomHTML(blockId, config);
  }

  // Minify HTML and CSS
  const minifiedHtml = minifyHTML(html);
  const minifiedCss = minifyCSS(css);

  return { html: minifiedHtml, css: minifiedCss };
}

/**
 * Generate CSS from block configuration
 */
function generateCSS(blockId: string, config: BlockConfigData): string {
  const { colors, typography, spacing, effects } = config;

  return `
.${blockId} {
  --primary-color: ${colors.textPrimary};
  --secondary-color: ${colors.textSecondary};
  --accent-color: ${colors.accentColor};
  --bg-color: ${colors.background};
  --border-color: ${colors.borderColor};
  --font-family: ${typography.fontFamily};
  --title-size: ${typography.titleSize}px;
  --subtitle-size: ${typography.subtitleSize}px;
  --body-size: ${typography.bodySize}px;
  --line-height: ${typography.lineHeight};
  --padding: ${spacing.padding}px;
  --margin: ${spacing.margin}px;
  --border-radius: ${spacing.borderRadius}px;
  --gap: ${spacing.gap}px;
  --shadow: ${effects.shadow};
  --opacity: ${effects.opacity};
  --border-width: ${effects.borderWidth}px;
  
  font-family: var(--font-family);
  background: ${colors.backgroundGradient || colors.background};
  color: var(--primary-color);
  padding: var(--padding);
  margin: var(--margin);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  opacity: var(--opacity);
}

.${blockId} h1, .${blockId} h2, .${blockId} h3 {
  font-size: var(--title-size);
  color: var(--primary-color);
  margin-bottom: var(--gap);
}

.${blockId} h2 {
  font-size: var(--subtitle-size);
}

.${blockId} p, .${blockId} span {
  font-size: var(--body-size);
  line-height: var(--line-height);
  color: var(--secondary-color);
}

.${blockId} .item {
  display: flex;
  align-items: center;
  gap: var(--gap);
  margin-bottom: var(--gap);
}

.${blockId} .item-icon {
  color: var(--accent-color);
  flex-shrink: 0;
}

.${blockId} button {
  background-color: var(--accent-color);
  color: white;
  border: var(--border-width) solid var(--accent-color);
  border-radius: var(--border-radius);
  padding: var(--padding);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--body-size);
  transition: all 0.3s ease;
}

.${blockId} button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.${blockId} .list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.${blockId} .list li {
  display: flex;
  align-items: center;
  gap: var(--gap);
  margin-bottom: var(--gap);
}

@media (max-width: 768px) {
  .${blockId} {
    padding: calc(var(--padding) * 0.75);
  }
  
  .${blockId} h1, .${blockId} h2, .${blockId} h3 {
    font-size: calc(var(--title-size) * 0.85);
  }
}
  `.trim();
}

/**
 * Generate Pricing Card HTML
 */
function generatePricingCardHTML(blockId: string, config: BlockConfigData): string {
  const { title, subtitle, description, content } = config;
  const button = content.button;

  return `
<div class="${blockId}">
  <div class="pricing-card">
    ${title ? `<h2>${title}</h2>` : ""}
    ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
    ${description ? `<p class="description">${description}</p>` : ""}
    
    ${content.items.length > 0 ? `
      <ul class="list">
        ${content.items.map(item => `
          <li class="item">
            ${item.icon ? `<span class="item-icon"><i class="fas fa-${item.icon}"></i></span>` : ""}
            <span>${item.content}</span>
          </li>
        `).join("")}
      </ul>
    ` : ""}
    
    ${button ? `<button>${button.text}</button>` : ""}
  </div>
</div>
  `.trim();
}

/**
 * Generate Feature List HTML
 */
function generateFeatureListHTML(blockId: string, config: BlockConfigData): string {
  const { title, content } = config;

  return `
<div class="${blockId}">
  ${title ? `<h2>${title}</h2>` : ""}
  <ul class="list">
    ${content.items.map(item => `
      <li class="item">
        ${item.icon ? `<span class="item-icon"><i class="fas fa-${item.icon}"></i></span>` : ""}
        <div>
          ${item.content ? `<strong>${item.content}</strong>` : ""}
          ${item.children?.[0]?.content ? `<p>${item.children[0].content}</p>` : ""}
        </div>
      </li>
    `).join("")}
  </ul>
</div>
  `.trim();
}

/**
 * Generate Hero Section HTML
 */
function generateHeroSectionHTML(blockId: string, config: BlockConfigData): string {
  const { title, subtitle, description, content } = config;
  const button = content.button;

  return `
<div class="${blockId}">
  <div class="hero-content">
    ${title ? `<h1>${title}</h1>` : ""}
    ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
    ${description ? `<p class="description">${description}</p>` : ""}
    ${button ? `<button>${button.text}</button>` : ""}
  </div>
</div>
  `.trim();
}

/**
 * Generate Testimonial HTML
 */
function generateTestimonialHTML(blockId: string, config: BlockConfigData): string {
  const { title, description, content } = config;

  return `
<div class="${blockId}">
  <div class="testimonial">
    ${description ? `<p class="quote">"${description}"</p>` : ""}
    ${title ? `<p class="author">— ${title}</p>` : ""}
    ${content.items.length > 0 ? `
      <div class="rating">
        ${content.items[0]?.content || ""}
      </div>
    ` : ""}
  </div>
</div>
  `.trim();
}

/**
 * Generate CTA Section HTML
 */
function generateCTASectionHTML(blockId: string, config: BlockConfigData): string {
  const { title, subtitle, description, content } = config;
  const button = content.button;

  return `
<div class="${blockId}">
  <div class="cta-section">
    ${title ? `<h2>${title}</h2>` : ""}
    ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
    ${description ? `<p class="description">${description}</p>` : ""}
    ${button ? `<button>${button.text}</button>` : ""}
  </div>
</div>
  `.trim();
}

/**
 * Generate Team Member HTML
 */
function generateTeamMemberHTML(blockId: string, config: BlockConfigData): string {
  const { title, subtitle, description } = config;

  return `
<div class="${blockId}">
  <div class="team-member">
    ${title ? `<h3>${title}</h3>` : ""}
    ${subtitle ? `<p class="role">${subtitle}</p>` : ""}
    ${description ? `<p class="bio">${description}</p>` : ""}
  </div>
</div>
  `.trim();
}

/**
 * Generate Service Card HTML
 */
function generateServiceCardHTML(blockId: string, config: BlockConfigData): string {
  const { title, description, content } = config;

  return `
<div class="${blockId}">
  <div class="service-card">
    ${content.items[0]?.icon ? `<div class="icon"><i class="fas fa-${content.items[0].icon}"></i></div>` : ""}
    ${title ? `<h3>${title}</h3>` : ""}
    ${description ? `<p>${description}</p>` : ""}
  </div>
</div>
  `.trim();
}

/**
 * Generate Custom HTML
 */
function generateCustomHTML(blockId: string, config: BlockConfigData): string {
  const { title, description, content } = config;

  return `
<div class="${blockId}">
  ${title ? `<h2>${title}</h2>` : ""}
  ${description ? `<p>${description}</p>` : ""}
  ${content.items.length > 0 ? `
    <ul class="list">
      ${content.items.map(item => `
        <li class="item">
          ${item.icon ? `<span class="item-icon"><i class="fas fa-${item.icon}"></i></span>` : ""}
          <span>${item.content}</span>
        </li>
      `).join("")}
    </ul>
  ` : ""}
</div>
  `.trim();
}

/**
 * Minify HTML by removing unnecessary whitespace
 */
function minifyHTML(html: string): string {
  return html
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

/**
 * Minify CSS by removing unnecessary whitespace and comments
 */
function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .trim();
}

export type AppRouter = typeof appRouter;
