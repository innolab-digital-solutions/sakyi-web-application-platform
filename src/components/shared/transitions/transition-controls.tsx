"use client";

import { Settings } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTransition } from "@/context/transition-context";
import { TRANSITION_PRESETS } from "@/lib/transitions/presets";
import { TransitionType } from "@/types/shared/transitions";

interface TransitionControlsProperties {
  className?: string;
}

export default function TransitionControls({ className = "" }: TransitionControlsProperties) {
  const { currentTransition, setTransition } = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`flex items-center gap-2 ${className}`}>
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Transition: {currentTransition}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Page Transitions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(TRANSITION_PRESETS).map(([type, config]) => (
          <DropdownMenuItem
            key={type}
            onClick={() => setTransition(type as TransitionType)}
            className={currentTransition === type ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium capitalize">{type}</span>
              <span className="text-muted-foreground text-xs">
                {config.duration}s • {config.ease}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
