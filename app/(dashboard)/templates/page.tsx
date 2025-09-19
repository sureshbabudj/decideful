import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { categoryTemplates, templates } from "@/data/templates";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground/90">
          Decision Templates
        </h1>
        <p className="text-foreground/60 mt-1">
          Choose from our curated templates to guide your decision-making
          process.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground/90 mb-4">
          Template Types
        </h2>
        <div className="flex flex-wrap items-stretch">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Link
                href={`/decisions/new?type=${template.id}`}
                key={template.id}
                className="block self-stretch w-full md:w-1/3 md:pr-4 pb-4 last:pr-0"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${template.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-4">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow items-stretch">
                    <p className="text-foreground/60 mb-4">
                      {template.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground/90">
                        Key Questions:
                      </p>
                      <ul className="space-y-1">
                        {template.questions.map((question, index) => (
                          <li
                            key={index}
                            className="text-sm text-foreground/60"
                          >
                            • {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex-grow" />
                    <Button
                      className="w-full mt-4 self-baseline-last"
                      variant="outline"
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground/90 mb-4">
          Category-Specific Templates
        </h2>
        <div className="space-y-6">
          {categoryTemplates.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.category}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-background/10">
                      <Icon className="h-5 w-5 text-foreground/60" />
                    </div>
                    <CardTitle>{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.templates.map((template, index) => (
                      <Link
                        key={index}
                        href={`/decisions/new?template=${category.category.toLowerCase()}-${index}`}
                        className="p-4 border border-border/80 rounded-lg hover:border-border cursor-pointer transition-colors"
                      >
                        <h3 className="font-medium text-foreground/90 mb-1">
                          {template.title}
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {template.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Pro Tips for Using Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-foreground/60">
            <li>
              • Choose the right template type based on the complexity of your
              decision
            </li>
            <li>
              • Be honest and thorough in your responses to get the most value
            </li>
            <li>
              • Set appropriate review dates to track your decision outcomes
            </li>
            <li>
              • Use category-specific templates for domain-specific guidance
            </li>
            <li>
              • Don&apos;t rush - take time to think through each question
              carefully
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
