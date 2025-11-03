"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/admin/shared/page-header";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
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

  const form = useForm(
    {
      title: "",
      description: "",
      thumbnail: undefined as File | string | undefined,
      duration_value: 1,
      duration_unit: "days" as "days" | "weeks" | "months",
      price: 0,
      status: "draft" as "draft" | "published" | "archived",
      ideals: undefined as Array<IdealInput> | undefined,
      key_features: undefined as Array<KeyFeatureInput> | undefined,
      expected_outcomes: undefined as Array<ExpectedOutcomeInput> | undefined,
      structures: undefined as Array<StructureInput> | undefined,
      faqs: undefined as Array<FaqInput> | undefined,
    },
    {
      validate: isEdit ? EditProgramSchema : CreateProgramSchema,
      tanstack: {
        invalidateQueries: ["admin-programs"],
        mutationOptions: {
          onSuccess: (response) => {
            toast.success(response.message);
          },
          onError: (error) => toast.error(error.message),
        },
      },
    },
  );

  useEffect(() => {
    if (isEdit && program) {
      const newData = {
        title: program.title ?? "",
        description: program.description ?? "",
        thumbnail: program.thumbnail_url || undefined,
        duration_value: Number(program.duration_value) || 1,
        duration_unit: (program.duration_unit as "days" | "weeks" | "months") ?? "days",
        price: Number(program.price) || 0,
        status: (program.status as "draft" | "published" | "archived") ?? "draft",
        ideals:
          program.ideals?.map((ideal) => ({ id: ideal.id, description: ideal.description })) ??
          undefined,
        key_features:
          program.key_features?.map((feature) => ({ id: feature.id, feature: feature.feature })) ??
          undefined,
        expected_outcomes:
          program.expected_outcomes?.map((outcome) => ({
            id: outcome.id,
            outcome: outcome.outcome,
          })) ?? undefined,
        structures:
          program.structures?.map((s) => ({
            id: s.id,
            week: String(s.week),
            title: s.title,
            description: s.description,
          })) ?? undefined,
        faqs:
          program.faqs?.map((faq) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
          })) ?? undefined,
      };
      form.setDataAndDefaults(newData);
    } else {
      form.reset();
      form.setDefaults(form.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && program?.id) {
      form.put(ENDPOINTS.ADMIN.PROGRAMS.UPDATE(program.id));
    } else {
      form.post(ENDPOINTS.ADMIN.PROGRAMS.STORE);
    }
  };

  const Section = ({ title }: { title: string }) => (
    <div className="border-b border-gray-200 pt-4 pb-2">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    </div>
  );

  const ArrayEditor = <T extends { id?: number | null }>(arguments_: {
    label: string;
    items: T[] | undefined;
    onChange: (items: T[] | undefined) => void;
    render: (item: T, onItemChange: (next: Partial<T>) => void) => React.ReactNode;
    emptyItem: () => T;
  }) => {
    const items = (arguments_.items ?? []) as T[];
    return (
      <div className="flex flex-col gap-3">
        <Section title={arguments_.label} />
        <div className="flex flex-col gap-3">
          {items.length === 0 && (
            <div className="text-muted-foreground text-sm">No items added.</div>
          )}
          {items.map((item, index) => (
            <div key={index} className="rounded-md border border-gray-200 p-3">
              {arguments_.render(item, (next) => {
                const copy = [...items];
                copy[index] = { ...copy[index], ...(next as T) };
                arguments_.onChange(copy);
              })}
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    const copy = [...items];
                    copy.splice(index, 1);
                    arguments_.onChange(copy.length > 0 ? copy : undefined);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => arguments_.onChange([...(items ?? []), arguments_.emptyItem()])}
            >
              Add {arguments_.label.slice(0, -1)}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={ClipboardList}
        title={isEdit ? "Edit Program" : "Create Program"}
        description={
          isEdit
            ? "Edit the program details including title, description, duration, pricing, status and related items."
            : "Create a new program with title, description, duration, pricing, status and related items."
        }
        actions={
          <Button variant="outline" asChild>
            <Link href={PATHS.ADMIN.PROGRAMS.LIST}>Go Back</Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Section title="Basic Details" />

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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

        <SelectField
          id="status"
          name="status"
          label="Status"
          value={String(form.data.status)}
          onChange={(v) => form.setData("status", v as "draft" | "published" | "archived")}
          error={form.errors.status as string}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
          required
          disabled={form.processing}
        />

        {ArrayEditor<IdealInput>({
          label: "Ideals",
          items: form.data.ideals ?? undefined,
          onChange: (items) => form.setData("ideals", items),
          render: (item: { id?: number | null; description: string }, onItemChange) => (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                id="ideal-description"
                name="ideal-description"
                type="text"
                value={String(item.description ?? "")}
                onChange={(event) => onItemChange({ description: event.target.value })}
                error={undefined}
                label="Description"
                placeholder="e.g., For individuals looking to lose weight"
                required
              />
            </div>
          ),
          emptyItem: () => ({ description: "" }),
        })}

        {ArrayEditor<KeyFeatureInput>({
          label: "Key Features",
          items: form.data.key_features ?? undefined,
          onChange: (items) => form.setData("key_features", items),
          render: (item: { id?: number | null; feature: string }, onItemChange) => (
            <InputField
              id="feature"
              name="feature"
              type="text"
              value={String(item.feature ?? "")}
              onChange={(event) => onItemChange({ feature: event.target.value })}
              error={undefined}
              label="Feature"
              placeholder="e.g., Personalized meal plans"
              required
            />
          ),
          emptyItem: () => ({ feature: "" }),
        })}

        {ArrayEditor<ExpectedOutcomeInput>({
          label: "Expected Outcomes",
          items: form.data.expected_outcomes ?? undefined,
          onChange: (items) => form.setData("expected_outcomes", items),
          render: (item: { id?: number | null; outcome: string }, onItemChange) => (
            <InputField
              id="outcome"
              name="outcome"
              type="text"
              value={String(item.outcome ?? "")}
              onChange={(event) => onItemChange({ outcome: event.target.value })}
              error={undefined}
              label="Outcome"
              placeholder="e.g., Lose 5-10kg in 30 days"
              required
            />
          ),
          emptyItem: () => ({ outcome: "" }),
        })}

        {ArrayEditor<StructureInput>({
          label: "Structures",
          items: form.data.structures ?? undefined,
          onChange: (items) => form.setData("structures", items),
          render: (
            item: { id?: number | null; week: string; title: string; description?: string | null },
            onItemChange,
          ) => (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <InputField
                id="structure-week"
                name="structure-week"
                type="text"
                value={String(item.week ?? "")}
                onChange={(event) => onItemChange({ week: event.target.value })}
                error={undefined}
                label="Week"
                placeholder="e.g., Week 1"
                required
              />
              <InputField
                id="structure-title"
                name="structure-title"
                type="text"
                value={String(item.title ?? "")}
                onChange={(event) => onItemChange({ title: event.target.value })}
                error={undefined}
                label="Title"
                placeholder="e.g., Foundation Week"
                required
              />
              <TextareaField
                id="structure-description"
                name="structure-description"
                className="min-h-[64px]"
                value={String(item.description ?? "")}
                onChange={(event) => onItemChange({ description: event.target.value })}
                error={undefined}
                label="Description"
                placeholder="e.g., Focus on building basic habits"
              />
            </div>
          ),
          emptyItem: () => ({ week: "", title: "", description: "" }),
        })}

        {ArrayEditor<FaqInput>({
          label: "FAQs",
          items: form.data.faqs ?? undefined,
          onChange: (items) => form.setData("faqs", items),
          render: (
            item: { id?: number | null; question: string; answer: string },
            onItemChange,
          ) => (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                id="faq-question"
                name="faq-question"
                type="text"
                value={String(item.question ?? "")}
                onChange={(event) => onItemChange({ question: event.target.value })}
                error={undefined}
                label="Question"
                placeholder="e.g., Who is this program for?"
                required
              />
              <TextareaField
                id="faq-answer"
                name="faq-answer"
                className="min-h-[64px]"
                value={String(item.answer ?? "")}
                onChange={(event) => onItemChange({ answer: event.target.value })}
                error={undefined}
                label="Answer"
                placeholder="Provide a detailed answer"
                required
              />
            </div>
          ),
          emptyItem: () => ({ question: "", answer: "" }),
        })}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing || (isEdit && !form.isDirty)}>
            {form.processing
              ? isEdit
                ? "Saving Changes..."
                : "Creating Program..."
              : isEdit
                ? "Save Changes"
                : "Create Program"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={PATHS.ADMIN.PROGRAMS.LIST}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
