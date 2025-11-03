"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { CreateProgramSchema, EditProgramSchema } from "@/lib/validations/admin/program-schema";
import { Program } from "@/types/admin/program";

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
type FaqInput = { id?: number | null; question: string; answer: string };

export default function ProgramFormPage({ program }: ProgramFormPageProperties) {
  const isEdit = Boolean(program);
  const router = useRouter();
  const form = useForm(
    {
      title: "",
      description: "",
      thumbnail: undefined as File | string | undefined,
      duration_value: 1,
      duration_unit: program?.duration_unit ?? ("days" as "days" | "weeks" | "months"),
      price: 0,
      status: "draft" as "draft" | "published" | "archived",
      ideals: [{ description: "" }] as Array<IdealInput>,
      key_features: [{ feature: "" }] as Array<KeyFeatureInput>,
      expected_outcomes: [{ outcome: "" }] as Array<ExpectedOutcomeInput>,
      structures: [{ week: "", title: "", description: "" }] as Array<StructureInput>,
      faqs: [{ question: "", answer: "" }] as Array<FaqInput>,
    },
    {
      validate: isEdit ? EditProgramSchema : CreateProgramSchema,
      tanstack: {
        invalidateQueries: ["admin-programs", "admin-program"],
        mutationOptions: {
          onSuccess: (response) => {
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

      const newData = {
        title: program.title ?? "",
        description: program.description ?? "",
        thumbnail: program.thumbnail_url || undefined,
        duration_value: parseNumber(program.duration_value, 1),
        duration_unit: (program?.duration_unit ?? "days") as "days" | "weeks" | "months",
        price: parseNumber(program.price, 0),
        status: (program?.status ?? "draft") as "draft" | "published" | "archived",
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
        faqs: (program.faqs?.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
        })) ?? [{ question: "", answer: "" }]) as Array<FaqInput>,
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
    fd.append("title", String(payload.title ?? ""));
    fd.append("description", String(payload.description ?? ""));
    if (payload.thumbnail instanceof File) {
      fd.append("thumbnail", payload.thumbnail);
    }
    fd.append("duration_value", String(payload.duration_value ?? 1));
    fd.append("duration_unit", String(payload.duration_unit ?? "days"));
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
    for (const [index, item] of ((payload.faqs ?? []) as FaqInput[]).entries()) {
      fd.append(`faqs[${index}][question]`, String(item.question ?? ""));
      fd.append(`faqs[${index}][answer]`, String(item.answer ?? ""));
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
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Basics */}
          <div className="h-fit space-y-5 rounded-md border border-gray-200 p-6">
            <SectionHeader
              title="Basic Details"
              description="Add the essentials—thumbnail, title, description, duration with unit, and price—so the program is clear at a glance."
            />
            <div className="space-y-4">
              <FileUploadField
                id="program-thumbnail"
                label="Thumbnail"
                value={form.data.thumbnail}
                onChange={(file) => form.setData("thumbnail", file as File | undefined)}
                maxSize={2 * 1024 * 1024}
                accept="image/jpg,image/jpeg,image/png,image/webp"
                required={!isEdit}
                error={form.errors.thumbnail as string}
              />

              <InputField
                id="title"
                name="title"
                type="text"
                value={String(form.data.title ?? "")}
                onChange={(event) => form.setData("title", event.target.value)}
                error={form.errors.title as string}
                label="Title"
                placeholder="Program title"
                required
                disabled={form.processing}
              />

              <TextareaField
                id="description"
                name="description"
                className="min-h-[96px]"
                placeholder="Describe the program..."
                value={String(form.data.description ?? "")}
                onChange={(event) => form.setData("description", event.target.value)}
                error={form.errors.description as string}
                label="Description"
                disabled={form.processing}
                required
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  id="duration_value"
                  name="duration_value"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={365}
                  step={1}
                  value={String(form.data.duration_value ?? 1)}
                  onChange={(event) => form.setData("duration_value", Number(event.target.value))}
                  error={form.errors.duration_value as string}
                  label="Duration"
                  required
                  disabled={form.processing}
                />

                <SelectField
                  id="duration_unit"
                  name="duration_unit"
                  label="Unit"
                  value={String(form.data.duration_unit)}
                  onChange={(v) => form.setData("duration_unit", v as "days" | "weeks" | "months")}
                  error={form.errors.duration_unit as string}
                  options={[
                    { value: "days", label: "Days" },
                    { value: "weeks", label: "Weeks" },
                    { value: "months", label: "Months" },
                  ]}
                  required
                  disabled={form.processing}
                />
              </div>

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
                required
                disabled={form.processing}
              />
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-5 rounded-md border border-gray-200 p-6">
            {/* Ideals */}
            <Collapsible defaultOpen>
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <SectionHeader
                    title="Ideals"
                    description="Define the audience this program serves (e.g., beginners, busy professionals). Keep each item concise and specific."
                  />
                  <div className="order-2 flex items-center gap-2 md:order-none md:shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        form.setData("ideals", [
                          ...((form.data.ideals ?? []) as IdealInput[]),
                          { description: "" },
                        ])
                      }
                      className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add ideal
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle Ideals"
                        className="transition hover:!bg-gray-200 hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
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
                          placeholder="e.g., For individuals looking to lose weight"
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
            <Collapsible defaultOpen>
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <SectionHeader
                    title="Key Features"
                    description="Highlight the benefits that set this program apart—short, punchy statements work best."
                  />
                  <div className="order-2 flex items-center gap-2 md:order-none md:shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        form.setData("key_features", [
                          ...(((form.data.key_features ?? []) as KeyFeatureInput[]) ?? []),
                          { feature: "" },
                        ])
                      }
                      className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add feature
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle Features"
                        className="transition hover:!bg-gray-200 hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
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
                          placeholder="e.g., Personalized meal plans"
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
                          const items = [...((form.data.key_features ?? []) as KeyFeatureInput[])];
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
            <Collapsible defaultOpen>
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <SectionHeader
                    title="Expected Outcomes"
                    description="Spell out realistic results participants should expect upon completion to set the right expectations."
                  />
                  <div className="order-2 flex items-center gap-2 md:order-none md:shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        form.setData("expected_outcomes", [
                          ...(((form.data.expected_outcomes ?? []) as ExpectedOutcomeInput[]) ??
                            []),
                          { outcome: "" },
                        ])
                      }
                      className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add outcome
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle Outcomes"
                        className="transition hover:!bg-gray-200 hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
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
                          placeholder="e.g., Lose 5-10kg in 30 days"
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
            <Collapsible defaultOpen>
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <SectionHeader
                    title="Structures"
                    description="Break the program into weekly blocks. Give each week a brief title and optional note on focus or activities."
                  />
                  <div className="order-2 flex items-center gap-2 md:order-none md:shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        form.setData("structures", [
                          ...(((form.data.structures ?? []) as StructureInput[]) ?? []),
                          { week: "", title: "", description: "" },
                        ])
                      }
                      className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add structure
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle Structures"
                        className="transition hover:!bg-gray-200 hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
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
                              placeholder="e.g., Week 1"
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
                              placeholder="e.g., Foundation Week"
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
                              placeholder="e.g., Focus on building basic habits"
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
                              const items = [...((form.data.structures ?? []) as StructureInput[])];
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

            {/* FAQs */}
            <Collapsible defaultOpen>
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <SectionHeader
                    title="FAQs"
                    description="Capture common questions and provide clear, helpful answers to reduce back‑and‑forth."
                  />
                  <div className="order-2 flex items-center gap-2 md:order-none md:shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        form.setData("faqs", [
                          ...(((form.data.faqs ?? []) as FaqInput[]) ?? []),
                          { question: "", answer: "" },
                        ])
                      }
                      className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add FAQ
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle FAQs"
                        className="transition hover:!bg-gray-200 hover:text-gray-600 data-[state=open]:[&_svg]:rotate-180"
                      >
                        <ChevronDown className="h-4 w-4 transition-transform" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent className="space-y-4 px-4 py-5">
                  {(form.data.faqs as FaqInput[]).map((item, index) => (
                    <React.Fragment key={`faq-${index}`}>
                      <div className="flex w-full items-start justify-between gap-3">
                        <div className="w-full space-y-4">
                          <div>
                            <InputField
                              id={`faq-${index}-question`}
                              label="Question"
                              placeholder="e.g., Who is this program for?"
                              value={String(item.question ?? "")}
                              onChange={(event) => {
                                const items = [...((form.data.faqs ?? []) as FaqInput[])];
                                items[index].question = event.target.value;
                                form.setData("faqs", items);
                              }}
                              error={form.errors[`faqs.${index}.question`] as string}
                              required
                            />
                          </div>
                          <div>
                            <TextareaField
                              id={`faq-${index}-answer`}
                              className="min-h-[64px] w-full"
                              label="Answer"
                              placeholder="Provide a detailed answer"
                              value={String(item.answer ?? "")}
                              onChange={(event) => {
                                const items = [...((form.data.faqs ?? []) as FaqInput[])];
                                items[index].answer = event.target.value;
                                form.setData("faqs", items);
                              }}
                              error={form.errors[`faqs.${index}.answer`] as string}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-start justify-end md:pl-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const items = [...((form.data.faqs ?? []) as FaqInput[])];
                              if (items.length <= 1) return;
                              items.splice(index, 1);
                              form.setData("faqs", items);
                            }}
                            disabled={(form.data.faqs as FaqInput[]).length <= 1}
                            className="hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Remove FAQ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {index !== (form.data.faqs as FaqInput[]).length - 1 && (
                        <Separator className="my-5" />
                      )}
                    </React.Fragment>
                  ))}
                </CollapsibleContent>
              </div>
            </Collapsible>

            <Separator className="mt-8 mb-7" />

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer bg-gray-100 hover:bg-gray-50 hover:text-gray-800"
              >
                Cancel
              </Button>

              <Button
                type="submit"
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
