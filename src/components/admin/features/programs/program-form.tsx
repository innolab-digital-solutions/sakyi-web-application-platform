"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { CreateProgramSchema, EditProgramSchema } from "@/lib/validations/admin/program-schema";
import { Program, ProgramApiResponse } from "@/types/admin/program";
import { ApiResponse } from "@/types/shared/api";

const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
  if (event.key === "Enter" && event.target instanceof HTMLElement) {
    const isTextarea = event.target.tagName === "TEXTAREA";
    const targetElement = event.target as HTMLElement;
    const isSubmitButton =
      (targetElement instanceof HTMLButtonElement && targetElement.type === "submit") ||
      targetElement.closest('button[type="submit"]') !== null;

    if (!isTextarea && !isSubmitButton) {
      event.preventDefault();
    }
  }
};

type ProgramFormPageProperties = {
  program?: Program;
};

type IdealInput = { id?: number | null; description: string };
type KeyFeatureInput = { id?: number | null; feature: string };
type ExpectedOutcomeInput = { id?: number | null; outcome: string };
type StructureInput = {
  id?: number | null;
  week: string;
  title: string;
  description?: string | null;
};

export default function ProgramFormPage({ program }: ProgramFormPageProperties) {
  const isEdit = Boolean(program);
  const router = useRouter();
  const [idealsOpen, setIdealsOpen] = useState(true);
  const [keyFeaturesOpen, setKeyFeaturesOpen] = useState(true);
  const [expectedOutcomesOpen, setExpectedOutcomesOpen] = useState(true);
  const [structuresOpen, setStructuresOpen] = useState(true);

  const form = useForm(
    {
      code: "",
      title: "",
      tagline: "",
      overview: "",
      description: "",
      thumbnail: undefined as File | string | undefined,
      background_image: undefined as File | string | undefined,
      duration: "",
      price: 0,
      status: "draft" as "draft" | "published",
      ideals: [{ description: "" }] as Array<IdealInput>,
      key_features: [{ feature: "" }] as Array<KeyFeatureInput>,
      expected_outcomes: [{ outcome: "" }] as Array<ExpectedOutcomeInput>,
      structures: [{ week: "", title: "", description: "" }] as Array<StructureInput>,
    },
    {
      validate: isEdit ? EditProgramSchema : CreateProgramSchema,
      tanstack: {
        invalidateQueries: ["admin-programs", "admin-program"],
        mutationOptions: {
          onSuccess: (response) => {
            // Optimistically update list cache like role-form
            form.queryCache.setQueryData<ProgramApiResponse>(
              ["admin-programs"],
              (previous) => {
                const base: ProgramApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as Program[],
                        message: (previous as { message?: string } | undefined)?.message ?? "",
                      } as ProgramApiResponse);

                const updatedFromServer = (response as unknown as { data?: Program | Program[] })
                  .data as Program | Program[] | undefined;
                const baseData = ((base?.data as Program[]) ?? []) as Program[];

                if (isEdit && program?.id) {
                  const nextProgram = Array.isArray(updatedFromServer)
                    ? updatedFromServer[0]
                    : (updatedFromServer as Program | undefined);
                  const existing = baseData.find((p) => p.id === program.id);
                  const merged =
                    nextProgram ??
                    (existing
                      ? {
                          ...existing,
                          code: `SKP-${String(form.data.code ?? "")}`,
                          title: String(form.data.title ?? ""),
                          tagline: String(form.data.tagline ?? ""),
                          description: String(form.data.description ?? ""),
                          duration: String(form.data.duration ?? ""),
                          price: String(form.data.price ?? 0),
                          status: String(form.data.status ?? "draft") as "draft" | "published",
                          thumbnail:
                            typeof form.data.thumbnail === "string"
                              ? form.data.thumbnail
                              : existing.thumbnail,
                          background_image:
                            typeof form.data.background_image === "string"
                              ? form.data.background_image
                              : existing.background_image,
                        }
                      : undefined);
                  if (!merged) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === program.id ? merged : r)),
                  } as ProgramApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  const created = Array.isArray(updatedFromServer)
                    ? updatedFromServer[0]
                    : (updatedFromServer as Program);
                  return { ...base, data: [created, ...baseData] } as ProgramApiResponse;
                }

                return base as ProgramApiResponse;
              },
              { all: true },
            );

            // Update the specific program cache too if available
            if (isEdit && program?.id) {
              form.queryCache.setQueryData<ApiResponse<Program> | undefined>(
                ["admin-program", String(program.id)],
                (previous: ApiResponse<Program> | undefined) => {
                  const nextProgram = (response as unknown as { data?: Program | Program[] })?.data;
                  if (!nextProgram) return previous;
                  return {
                    status: "success",
                    message: previous?.message ?? "",
                    data: Array.isArray(nextProgram) ? nextProgram[0] : nextProgram,
                  } as ApiResponse<Program>;
                },
              );
            }

            router.push(PATHS.ADMIN.PROGRAMS.LIST);
            toast.success(response.message);
          },
          onError: (error) => toast.error(error.message),
        },
      },
    },
  );

  useEffect(() => {
    if (isEdit && program) {
      const parseNumber = (value: unknown, fallback = 0): number => {
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string") {
          const cleaned = value.replaceAll(/[^0-9.\-]/g, "");
          const parsed = Number(cleaned);
          return Number.isNaN(parsed) ? fallback : parsed;
        }
        return fallback;
      };

      // Extract code without SKP- prefix for editing and ensure uppercase with dashes
      const extractCode = (fullCode: string | undefined): string => {
        if (!fullCode) return "";
        let code = fullCode.startsWith("SKP-") ? fullCode.slice(4) : fullCode;
        // Ensure uppercase and replace spaces with dashes
        code = code.toUpperCase().replaceAll(/\s+/g, "-");
        return code;
      };

      const newData = {
        code: extractCode(program.code),
        title: program.title ?? "",
        tagline: program.tagline ?? "",
        overview: program.overview ?? "",
        description: program.description ?? "",
        thumbnail: program.thumbnail || undefined,
        background_image: program.background_image || undefined,
        duration: program.duration ?? "",
        price: parseNumber(program.price, 0),
        status: ((program?.status === "archived" ? "draft" : program?.status) ?? "draft") as
          | "draft"
          | "published",
        ideals: (program.ideals?.map((ideal) => ({
          id: ideal.id,
          description: ideal.description,
        })) ?? [{ description: "" }]) as Array<IdealInput>,
        key_features: (program.key_features?.map((feature) => ({
          id: feature.id,
          feature: feature.feature,
        })) ?? [{ feature: "" }]) as Array<KeyFeatureInput>,
        expected_outcomes: (program.expected_outcomes?.map((outcome) => ({
          id: outcome.id,
          outcome: outcome.outcome,
        })) ?? [{ outcome: "" }]) as Array<ExpectedOutcomeInput>,
        structures: (program.structures?.map((s) => ({
          id: s.id,
          week: String(s.week),
          title: s.title,
          description: s.description,
        })) ?? [{ week: "", title: "", description: "" }]) as Array<StructureInput>,
      };
      form.setDataAndDefaults(newData);
    } else {
      form.reset();
      form.setDefaults(form.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.id]);

  // Build FormData payload matching Laravel array expectations
  const buildFormData = (payload: typeof form.data) => {
    const fd = new FormData();
    fd.append("code", String(payload.code ?? ""));
    fd.append("title", String(payload.title ?? ""));
    fd.append("tagline", String(payload.tagline ?? ""));
    fd.append("overview", String(payload.overview ?? ""));
    fd.append("description", String(payload.description ?? ""));
    if (payload.thumbnail instanceof File) {
      fd.append("thumbnail", payload.thumbnail);
    }
    if (payload.background_image instanceof File) {
      fd.append("background_image", payload.background_image);
    }
    fd.append("duration", String(payload.duration ?? ""));
    fd.append("price", String(payload.price ?? 0));
    fd.append("status", String(payload.status ?? "draft"));

    for (const [index, item] of ((payload.ideals ?? []) as IdealInput[]).entries()) {
      fd.append(`ideals[${index}][description]`, String(item.description ?? ""));
    }
    for (const [index, item] of ((payload.key_features ?? []) as KeyFeatureInput[]).entries()) {
      fd.append(`key_features[${index}][feature]`, String(item.feature ?? ""));
    }
    for (const [index, item] of (
      (payload.expected_outcomes ?? []) as ExpectedOutcomeInput[]
    ).entries()) {
      fd.append(`expected_outcomes[${index}][outcome]`, String(item.outcome ?? ""));
    }
    for (const [index, item] of ((payload.structures ?? []) as StructureInput[]).entries()) {
      fd.append(`structures[${index}][week]`, String(item.week ?? ""));
      fd.append(`structures[${index}][title]`, String(item.title ?? ""));
      if (item.description !== undefined) {
        fd.append(`structures[${index}][description]`, String(item.description ?? ""));
      }
    }
    return fd;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && program?.id) {
      form.put(ENDPOINTS.ADMIN.PROGRAMS.UPDATE(program.id), { transform: buildFormData });
    } else {
      form.post(ENDPOINTS.ADMIN.PROGRAMS.STORE, { transform: buildFormData });
    }
  };

  const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div>
      <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">{title}</h3>
      {description ? (
        <p className="line-clamp-2 text-sm text-gray-500 md:line-clamp-none">{description}</p>
      ) : undefined}
    </div>
  );

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-8">
        {/* Three Column Layout - Similar to Blog Post Form */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {/* Left Column: Images and Pricing */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1 lg:self-start">
            <SectionHeader
              title="Media & Pricing"
              description="Upload program images and configure pricing details."
            />
            <div className="space-y-6">
              <FileUploadField
                id="program-thumbnail"
                label="Web Thumbnail"
                value={form.data.thumbnail}
                onChange={(file) => form.setData("thumbnail", file as File | undefined)}
                maxSize={2 * 1024 * 1024}
                accept="image/jpg,image/jpeg,image/png,image/webp"
                required={true}
                error={form.errors.thumbnail as string}
              />

              <FileUploadField
                id="program-background-image"
                label="Mobile Background Image"
                value={form.data.background_image}
                onChange={(file) => form.setData("background_image", file as File | undefined)}
                maxSize={5 * 1024 * 1024}
                accept="image/jpg,image/jpeg,image/png,image/webp"
                required={true}
                error={form.errors.background_image as string}
              />

              <Separator />

              <div className="space-y-4">
                <InputField
                  id="duration"
                  name="duration"
                  type="text"
                  value={String(form.data.duration ?? "")}
                  onChange={(event) => form.setData("duration", event.target.value)}
                  error={form.errors.duration as string}
                  label="Duration"
                  placeholder="e.g., 30 days, 12 weeks, 3 months"
                  required
                  disabled={form.processing}
                />

                <InputField
                  id="price"
                  name="price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={999_999}
                  step="0.01"
                  value={String(form.data.price ?? 0)}
                  onChange={(event) => form.setData("price", Number(event.target.value))}
                  error={form.errors.price as string}
                  label="Price"
                  placeholder="e.g., 299.99, 1500.00, 499"
                  disabled={form.processing}
                />

                {/* Status Field */}
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                    Publication Status
                  </Label>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            form.data.status === "published" ? "text-primary" : "text-gray-600"
                          }`}
                        >
                          {form.data.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {form.data.status === "published"
                          ? "This program is live and visible to clients"
                          : "This program is saved as a draft and not yet published"}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch
                            id="status"
                            checked={form.data.status === "published"}
                            onCheckedChange={(checked) => {
                              form.setData("status", checked ? "published" : "draft");
                            }}
                            disabled={
                              form.processing || (isEdit && program?.status === "published")
                            }
                            aria-label="Toggle publication status"
                            className="disabled:cursor-not-allowed"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 shadow-lg">
                        <p className="text-sm">
                          {isEdit && program?.status === "published"
                            ? "Published programs cannot be reverted to draft. Once published, the program remains live. If you no longer want this program visible, you can move it to archive from the programs list."
                            : form.data.status === "published"
                              ? "Toggle to save as draft"
                              : "Toggle to publish this program"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {form.errors.status && (
                    <p className="text-sm text-red-600">{form.errors.status as string}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content and Details */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <SectionHeader
              title="Program Information"
              description="Enter program details, content, and structure."
            />
            <div className="space-y-6">
              <InputField
                id="code"
                name="code"
                type="text"
                value={String(form.data.code ?? "")}
                onChange={(event) => {
                  // Transform: uppercase and replace spaces with dashes
                  const transformed = event.target.value
                    .toUpperCase()
                    .replaceAll(/\s+/g, "-")
                    .replaceAll(/[^A-Z0-9-]/g, ""); // Only allow letters, numbers, and dashes
                  form.setData("code", transformed);
                }}
                error={form.errors.code as string}
                label="Code"
                placeholder="e.g., FIT-01, WELL-02, NUTR-10"
                description={
                  form.data.code
                    ? `Full code: SKP-${form.data.code}`
                    : "Enter the program code (without SKP- prefix). Spaces will be converted to dashes and text will be automatically converted to uppercase. The full code will be generated as SKP-{your-code}."
                }
                required
                disabled={form.processing}
              />

              <InputField
                id="tagline"
                name="tagline"
                type="text"
                value={String(form.data.tagline ?? "")}
                onChange={(event) => form.setData("tagline", event.target.value)}
                error={form.errors.tagline as string}
                label="Tagline"
                placeholder="e.g., Transform Your Health in 30 Days, Your Journey to Wellness Starts Here"
                required
                disabled={form.processing}
              />

              <InputField
                id="title"
                name="title"
                type="text"
                value={String(form.data.title ?? "")}
                onChange={(event) => form.setData("title", event.target.value)}
                error={form.errors.title as string}
                label="Title"
                placeholder="e.g., 30-Day Weight Loss Program, Complete Wellness Transformation, Healthy Lifestyle Challenge"
                required
                disabled={form.processing}
              />

              <TextareaField
                id="overview"
                name="overview"
                className="min-h-[100px]"
                placeholder="Enter a brief overview that summarizes the program's main purpose, target audience, and key benefits. This will appear in program listings and previews..."
                value={String(form.data.overview ?? "")}
                onChange={(event) => form.setData("overview", event.target.value)}
                error={form.errors.overview as string}
                label="Overview"
                disabled={form.processing}
                required
              />

              <TextareaField
                id="description"
                name="description"
                className="min-h-[120px]"
                placeholder="Provide a detailed description of the program, including what participants will learn, the approach used, and how it will help them achieve their goals..."
                value={String(form.data.description ?? "")}
                onChange={(event) => form.setData("description", event.target.value)}
                error={form.errors.description as string}
                label="Description"
                disabled={form.processing}
                required
              />
            </div>

            {/* Content sections */}
            <div className="space-y-6 pt-6">
              {/* Ideals */}
              <Collapsible open={idealsOpen} onOpenChange={setIdealsOpen}>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <SectionHeader
                      title="Target Audience"
                      description="Define who this program is designed for. Keep descriptions concise and specific to help participants identify if the program fits their needs."
                    />
                    <div className="order-2 flex items-center gap-2 md:order-0 md:shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIdealsOpen(true);
                          form.setData("ideals", [
                            ...((form.data.ideals ?? []) as IdealInput[]),
                            { description: "" },
                          ]);
                        }}
                        className="text-accent hover:text-accent/80 hover:bg-accent/10 flex cursor-pointer items-center gap-2"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add ideal
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Toggle Ideals"
                          className="transition hover:bg-gray-200! hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
                        >
                          <ChevronDown className="h-4 w-4 transition-transform" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent className="space-y-4 px-4 py-5">
                    {(form.data.ideals as IdealInput[]).map((item, index) => (
                      <div key={`ideal-${index}`} className="flex items-end gap-3">
                        <div className="flex-1">
                          <InputField
                            id={`ideal-${index}-description`}
                            placeholder="e.g., For individuals looking to lose weight, Busy professionals seeking work-life balance, Beginners starting their fitness journey"
                            value={String(item.description ?? "")}
                            onChange={(event) => {
                              const items = [...((form.data.ideals ?? []) as IdealInput[])];
                              items[index].description = event.target.value;
                              form.setData("ideals", items);
                            }}
                            error={form.errors[`ideals.${index}.description`] as string}
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const items = [...((form.data.ideals ?? []) as IdealInput[])];
                            if (items.length <= 1) return; // enforce min 1
                            items.splice(index, 1);
                            form.setData("ideals", items);
                          }}
                          disabled={(form.data.ideals as IdealInput[]).length <= 1}
                          className="hover:bg-destructive/10 hover:text-destructive self-end"
                          aria-label="Remove ideal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>

              {/* Key Features */}
              <Collapsible open={keyFeaturesOpen} onOpenChange={setKeyFeaturesOpen}>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <SectionHeader
                      title="Key Features"
                      description="Highlight the unique benefits and features that distinguish this program. Use clear, concise statements that emphasize value."
                    />
                    <div className="order-2 flex items-center gap-2 md:order-0 md:shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setKeyFeaturesOpen(true);
                          form.setData("key_features", [
                            ...(((form.data.key_features ?? []) as KeyFeatureInput[]) ?? []),
                            { feature: "" },
                          ]);
                        }}
                        className="text-accent hover:text-accent/80 hover:bg-accent/10 flex cursor-pointer items-center gap-2"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add feature
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Toggle Features"
                          className="transition hover:bg-gray-200! hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
                        >
                          <ChevronDown className="h-4 w-4 transition-transform" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent className="space-y-4 px-4 py-5">
                    {(form.data.key_features as KeyFeatureInput[]).map((item, index) => (
                      <div key={`feature-${index}`} className="flex items-end gap-3">
                        <div className="flex-1">
                          <InputField
                            id={`feature-${index}`}
                            placeholder="e.g., Personalized meal plans, 24/7 support from certified coaches, Progress tracking dashboard"
                            value={String(item.feature ?? "")}
                            onChange={(event) => {
                              const items = [
                                ...((form.data.key_features ?? []) as KeyFeatureInput[]),
                              ];
                              items[index].feature = event.target.value;
                              form.setData("key_features", items);
                            }}
                            error={form.errors[`key_features.${index}.feature`] as string}
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const items = [
                              ...((form.data.key_features ?? []) as KeyFeatureInput[]),
                            ];
                            if (items.length <= 1) return;
                            items.splice(index, 1);
                            form.setData("key_features", items);
                          }}
                          disabled={(form.data.key_features as KeyFeatureInput[]).length <= 1}
                          className="hover:bg-destructive/10 hover:text-destructive self-end"
                          aria-label="Remove feature"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>

              {/* Expected Outcomes */}
              <Collapsible open={expectedOutcomesOpen} onOpenChange={setExpectedOutcomesOpen}>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <SectionHeader
                      title="Expected Outcomes"
                      description="Define realistic results and achievements participants can expect upon program completion. Set clear, achievable expectations."
                    />
                    <div className="order-2 flex items-center gap-2 md:order-0 md:shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setExpectedOutcomesOpen(true);
                          form.setData("expected_outcomes", [
                            ...(((form.data.expected_outcomes ?? []) as ExpectedOutcomeInput[]) ??
                              []),
                            { outcome: "" },
                          ]);
                        }}
                        className="text-accent hover:text-accent/80 hover:bg-accent/10 flex cursor-pointer items-center gap-2"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add outcome
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Toggle Outcomes"
                          className="transition hover:bg-gray-200! hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
                        >
                          <ChevronDown className="h-4 w-4 transition-transform" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent className="space-y-4 px-4 py-5">
                    {(form.data.expected_outcomes as ExpectedOutcomeInput[]).map((item, index) => (
                      <div key={`outcome-${index}`} className="flex items-end gap-3">
                        <div className="flex-1">
                          <InputField
                            id={`outcome-${index}`}
                            placeholder="e.g., Lose 5-10kg in 30 days, Improve energy levels by 40%, Build sustainable healthy habits"
                            value={String(item.outcome ?? "")}
                            onChange={(event) => {
                              const items = [
                                ...((form.data.expected_outcomes ?? []) as ExpectedOutcomeInput[]),
                              ];
                              items[index].outcome = event.target.value;
                              form.setData("expected_outcomes", items);
                            }}
                            error={form.errors[`expected_outcomes.${index}.outcome`] as string}
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const items = [
                              ...((form.data.expected_outcomes ?? []) as ExpectedOutcomeInput[]),
                            ];
                            if (items.length <= 1) return;
                            items.splice(index, 1);
                            form.setData("expected_outcomes", items);
                          }}
                          disabled={
                            (form.data.expected_outcomes as ExpectedOutcomeInput[]).length <= 1
                          }
                          className="hover:bg-destructive/10 hover:text-destructive self-end"
                          aria-label="Remove outcome"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>

              {/* Structures */}
              <Collapsible open={structuresOpen} onOpenChange={setStructuresOpen}>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <SectionHeader
                      title="Program Structure"
                      description="Organize the program into weekly or monthly phases. Include a title and optional description for each phase to guide participants."
                    />
                    <div className="order-2 flex items-center gap-2 md:order-0 md:shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStructuresOpen(true);
                          form.setData("structures", [
                            ...(((form.data.structures ?? []) as StructureInput[]) ?? []),
                            { week: "", title: "", description: "" },
                          ]);
                        }}
                        className="text-accent hover:text-accent/80 hover:bg-accent/10 flex cursor-pointer items-center gap-2"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add structure
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Toggle Structures"
                          className="transition hover:bg-gray-200! hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
                        >
                          <ChevronDown className="h-4 w-4 transition-transform" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent className="space-y-4 px-4 py-5">
                    {(form.data.structures as StructureInput[]).map((item, index) => (
                      <React.Fragment key={`structure-${index}`}>
                        <div className="flex w-full items-start justify-between gap-3">
                          <div className="w-full space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <InputField
                                id={`structure-${index}-week`}
                                label="Week"
                                placeholder="e.g., Week 1, Week 2, Month 1"
                                value={String(item.week ?? "")}
                                onChange={(event) => {
                                  const items = [
                                    ...((form.data.structures ?? []) as StructureInput[]),
                                  ];
                                  items[index].week = event.target.value;
                                  form.setData("structures", items);
                                }}
                                error={form.errors[`structures.${index}.week`] as string}
                                required
                              />
                              <InputField
                                id={`structure-${index}-title`}
                                label="Title"
                                placeholder="e.g., Foundation Week, Building Momentum, Advanced Techniques"
                                value={String(item.title ?? "")}
                                onChange={(event) => {
                                  const items = [
                                    ...((form.data.structures ?? []) as StructureInput[]),
                                  ];
                                  items[index].title = event.target.value;
                                  form.setData("structures", items);
                                }}
                                error={form.errors[`structures.${index}.title`] as string}
                                required
                              />
                            </div>
                            <div>
                              <TextareaField
                                id={`structure-${index}-description`}
                                className="min-h-[64px] w-full"
                                label="Description"
                                placeholder="Enter details about this week's focus, activities, or learning objectives..."
                                value={String(item.description ?? "")}
                                onChange={(event) => {
                                  const items = [
                                    ...((form.data.structures ?? []) as StructureInput[]),
                                  ];
                                  items[index].description = event.target.value;
                                  form.setData("structures", items);
                                }}
                                error={form.errors[`structures.${index}.description`] as string}
                              />
                            </div>
                          </div>

                          <div className="flex items-start justify-end md:pl-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const items = [
                                  ...((form.data.structures ?? []) as StructureInput[]),
                                ];
                                if (items.length <= 1) return;
                                items.splice(index, 1);
                                form.setData("structures", items);
                              }}
                              disabled={(form.data.structures as StructureInput[]).length <= 1}
                              className="hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Remove structure"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {index !== (form.data.structures as StructureInput[]).length - 1 && (
                          <Separator className="my-5" />
                        )}
                      </React.Fragment>
                    ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>

            <Separator className="my-6" />

            {/* Actions Section */}
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(PATHS.ADMIN.PROGRAMS.LIST)}
                disabled={form.processing}
                className="cursor-pointer bg-gray-100 hover:bg-gray-50 hover:text-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={form.processing || (isEdit && !form.isDirty)}
                className="flex cursor-pointer items-center gap-2 font-semibold"
              >
                {form.processing
                  ? isEdit
                    ? "Saving Changes..."
                    : "Creating Program..."
                  : isEdit
                    ? "Save Changes"
                    : "Create Program"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
