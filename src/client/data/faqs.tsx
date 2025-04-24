import React from 'react';
import technologies from "./technologies";

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
          <>
            <p className="mb-2">Our CSV Translator uses a modern tech stack:</p>
            <ul className="list-disc pl-5 space-y-1">
              {technologies.map((tech, index) => (
                <li key={index}>
                  <span className="font-medium">{tech.category}:</span> {tech.name}
                </li>
              ))}
            </ul>
          </>
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
];

export default faqs;