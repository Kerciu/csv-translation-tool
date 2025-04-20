"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModeToggle() {

    const { theme, setTheme } = useTheme();

    const ANIMATION_DELAY = 300;
    const [isAnimating, setAnimating] = React.useState(false);

    const themes = ["light", "dark"] as const;
    const themeIcons = {
        light: Sun,
        dark: Moon
    } as const;

    const Icon = themeIcons[theme as keyof typeof themeIcons] || Moon;

    const handleClick = () => {
        setAnimating(true);
        const currentIdx = themes.indexOf(theme as typeof themes[number]);
        const nextIdx = (currentIdx + 1) % themes.length;

        setTheme(themes[nextIdx]);
        setTimeout(() => setAnimating(false), ANIMATION_DELAY);
    }

    return (
        <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        aria-label="Toggle theme"
        >
        <div className="relative h-[1.2rem] w-[1.2rem]">
            <Sun className={cn(
            "absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all",
            theme !== "light" && "-rotate-90 scale-0",
            isAnimating && "animate-pulse"
            )} />
            <Moon className={cn(
            "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all",
            theme === "dark" && "rotate-0 scale-100",
            isAnimating && "animate-pulse"
            )} />
        </div>
        </Button>
    )
}
