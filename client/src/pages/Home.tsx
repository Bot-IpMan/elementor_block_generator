import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Download, Paintbrush } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    title: "Live visual builder",
    description: "Tweak colors, typography, spacing and effects with instant preview for every template.",
    icon: Paintbrush,
  },
  {
    title: "Production-ready code",
    description: "Export minified HTML and CSS that drops directly into Elementor or any page builder.",
    icon: Download,
  },
  {
    title: "Reusable presets",
    description: "Save, duplicate, and iterate on block presets for pricing cards, hero sections, CTAs, and more.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-16 space-y-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-medium text-muted-foreground">Elementor Block Generator</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Створюйте красиві HTML-блоки для Elementor без коду
            </h1>
            <p className="text-lg text-muted-foreground">
              Налаштовуйте кольори, типографіку та контент у візуальному конфігураторі, отримуйте чистий HTML/CSS код та
              вставляйте його прямо у ваш сайт на WordPress.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/builder">
                <Button size="lg" className="gap-2">
                  Відкрити конструктор
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/builder">
                <Button size="lg" variant="outline">
                  Переглянути шаблони
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Що всередині?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">●</span>
                <p>7 готових шаблонів: hero, pricing, feature list, testimonial, CTA, team, service.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">●</span>
                <p>Експорт у форматі &lt;style&gt;+HTML з мінімізацією та підтримкою кастомних стилів.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">●</span>
                <p>Миттєвий попередній перегляд і кнопки копіювання або завантаження коду.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map(feature => (
            <Card key={feature.title} className="h-full">
              <CardHeader className="space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Кроки</p>
            <h2 className="text-3xl font-bold">Як це працює</h2>
            <ol className="space-y-3 text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">1.</span> Оберіть шаблон блоку та налаштуйте контент.
              </li>
              <li>
                <span className="font-semibold text-foreground">2.</span> Підберіть кольори, шрифти, відступи та ефекти.
              </li>
              <li>
                <span className="font-semibold text-foreground">3.</span> Скопіюйте готовий HTML/CSS або завантажте файл.
              </li>
            </ol>
            <Link href="/builder">
              <Button className="gap-2" variant="outline">
                Почати зараз
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Демо прев’ю</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>На сторінці конструктора ви побачите живий прев’ю з вашим стилем та текстом.</p>
              <p>Код генерується на бекенді, мінімізується і готовий до вставки в Elementor HTML widget.</p>
              <p className="text-foreground">Готово до продакшн з першого кліку.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
