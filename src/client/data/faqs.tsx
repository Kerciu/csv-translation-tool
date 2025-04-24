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
];

export default faqs;