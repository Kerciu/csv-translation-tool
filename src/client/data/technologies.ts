export type Technology = {
    category: string;
    used: string;
};

const technologies: Technology[] = [
    { category: "Frontend", used: "TypeScript (React + Next.js) & Tailwind CSS" },
    { category: "Backend", used: "Django REST (Python)" },
    { category: "Database", used: "MongoDB" },
    { category: "ML Translation", used: "HuggingFace's MarianMT models in Rust & PyO3 for language binding" },
    { category: "Infrastructure", used: "Docker & Redis" },
    { category: "Security", used: "JWT & OAuth2" },
];

export default technologies;