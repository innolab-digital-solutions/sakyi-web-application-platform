"use client";

import { ArrowRight, Play } from "lucide-react";
import React from "react";

import TransitionControls from "@/components/shared/transitions/transition-controls";
import TransitionLink from "@/components/shared/transitions/transition-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageTransition } from "@/hooks/use-page-transition";
import { TransitionType } from "@/types/shared/transitions";

interface TransitionDemoProperties {
  className?: string;
}

/**
 * Demo component showcasing different page transitions
 */
export default function TransitionDemo({ className = "" }: TransitionDemoProperties) {
  const { navigateWithTransition } = usePageTransition();

  const demoRoutes = [
    { path: "/admin/overview", label: "Overview", transition: "fade" as TransitionType },
    { path: "/admin/roles", label: "Roles", transition: "slideLeft" as TransitionType },
    { path: "/admin/programs", label: "Programs", transition: "slideRight" as TransitionType },
  ];

  const handleDemoNavigation = (path: string, transition: TransitionType) => {
    navigateWithTransition(path, transition);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Page Transitions Demo</CardTitle>
            <CardDescription>Test different animation types for page navigation</CardDescription>
          </div>
          <TransitionControls />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <h4 className="text-sm font-medium">Quick Navigation</h4>
          <div className="flex flex-wrap gap-2">
            {demoRoutes.map((route) => (
              <Button
                key={route.path}
                variant="outline"
                size="sm"
                onClick={() => handleDemoNavigation(route.path, route.transition)}
                className="flex items-center gap-2"
              >
                <Play className="h-3 w-3" />
                {route.label}
                <span className="text-muted-foreground text-xs">({route.transition})</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <h4 className="text-sm font-medium">Transition Types</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="font-medium">Fade</div>
              <div className="text-muted-foreground">Smooth opacity transition</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Slide</div>
              <div className="text-muted-foreground">Horizontal slide effect</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Scale</div>
              <div className="text-muted-foreground">Scale in/out animation</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Slide Up</div>
              <div className="text-muted-foreground">Vertical slide from bottom</div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <TransitionLink
            href="/admin/overview"
            transitionType="scale"
            className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
          >
            <ArrowRight className="h-3 w-3" />
            Go to Overview with Scale Transition
          </TransitionLink>
        </div>
      </CardContent>
    </Card>
  );
}
