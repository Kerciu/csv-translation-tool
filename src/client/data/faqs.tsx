import React from 'react';
import technologies from "./technologies";
import languages from './languages';

export type FAQItem = {
    id: string;
    question: string;
    answer: React.ReactNode;
}

const faqs: FAQItem[] = [
    {
        id: "technologies",
        question: "What technologies are used in this project?",
        answer: (
          <div className="space-y-3">
            <p className="text-muted-foreground mb-2">
              Our CSV Translator uses this modern stack:
            </p>
            
            <ul className="grid gap-3">
              {technologies.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <li 
                      key={tech.category}
                      className="flex items-start gap-3 p-3 bg-muted/10 rounded-lg border hover:bg-muted/20 transition-colors"
                    >
                      <div className="bg-primary/10 p-2 rounded-md shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">{tech.category}</h4>
                        <p className="text-sm">{tech.used}</p>
                      </div>
                    </li>
                  );
              })}
            </ul>
          </div>
        ),
    },
    {
      id: "creators",
      question: "Who created this project?",
      answer: (
        <p>
          This project was created by Kacper Górski and Szymon Kamiński, students at the Warsaw University of
          Technology (WUT). It was developed as part of our coursework in the Computer Science program,
          combining our interests in machine learning, full-stack development, and data processing.
        </p>
      ),
    },
    {
      id: "accuracy",
      question: "How accurate are the translations?",
      answer: (
        <p>
          Our translation system uses MarianMT models, which provide high-quality translations for most common
          languages. The accuracy varies by language pair, with European languages typically achieving 85-95%
          accuracy. For specialized terminology or uncommon languages, we recommend using the manual editing
          feature to refine translations.
        </p>
      ),
    },
    {
      id: "languages",
      question: "What languages are supported?",
      answer: (
        <>
          <p className="mb-2">We currently support {languages.length} languages including:</p>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <div key={lang.value}>
              {lang.flag && <span className="mr-2">{lang.flag}</span>}
              • {lang.label}
            </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "pricing",
      question: "Is this service free to use?",
      answer: (
        <p>
          Yes! This is currently a free academic project. We may introduce premium features in the future,
          but the core translation functionality will always remain free to use.
        </p>
      ),
    },
];

export default faqs;