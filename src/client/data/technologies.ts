export type Technology = {
    category: string;
    name: string;
};

const technologies: Technology[] = [
    { category: "Frontend", name: "TypeScript with React and Next.js" },
    { category: "Backend", name: "Django (Python) REST API" },
    { category: "Database", name: "MongoDB" },
    { category: "ML Translation", name: "HuggingFace's MarianMT models in Rust" },
    { category: "Caching", name: "Redis" },
    { category: "Contenerization", name: "Docker" },
    { category: "Authorization", name: "JWT & OAuth2" },
];

export default technologies;