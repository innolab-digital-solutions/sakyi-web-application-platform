/* eslint-disable unicorn/no-null */
"use client";

import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import DatepickerField from "@/components/shared/forms/datepicker-field";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import {
  type CreateOnboardingFormInput,
  CreateOnboardingFormSchema,
  QuestionTypeEnum,
} from "@/lib/validations/admin/onboarding-form-schema";

export default function OnboardingFormCreateForm() {
  const router = useRouter();

  type CreateSection = CreateOnboardingFormInput["sections"][number];
  type CreateQuestion = CreateSection["questions"][number];
  type QuestionType = (typeof QuestionTypeEnum)["options"][number];
  type QuestionEditableKey =
    | "question_text"
    | "question_type"
    | "required"
    | "help_text"
    | "options";

  const form = useForm(
    {
      title: "",
      description: "",
      status: "draft" as const,
      published_at: null,
      sections: [
        {
          title: "",
          description: "",
          order: 0,
          questions: [
            {
              question_text: "",
              question_type: "text" as const,
              required: true,
              help_text: "",
              options: null,
            },
          ],
        },
      ],
    },
    {
      validate: CreateOnboardingFormSchema,
      tanstack: {
        invalidateQueries: ["admin-onboarding-forms"],
        mutationOptions: {
          onSuccess: (response) => {
            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  const [openSections, setOpenSections] = React.useState<boolean[]>([true]);

  React.useEffect(() => {
    const length = Array.isArray(form.data.sections) ? form.data.sections.length : 0;
    setOpenSections((previous) => {
      const next = [...previous];
      while (next.length < length) next.push(true);
      if (next.length > length) next.length = length;
      return next;
    });
  }, [form.data.sections]);

  function defaultQuestion(): CreateQuestion {
    return {
      question_text: "",
      question_type: "text",
      required: true,
      help_text: "",
      options: null,
    } as CreateQuestion;
  }

  const addSection = () => {
    const sections = (form.data.sections ?? []) as CreateOnboardingFormInput["sections"];
    const nextOrder = sections.length;
    form.setData("sections", [
      ...sections,
      { title: "", description: "", order: nextOrder, questions: [defaultQuestion()] },
    ]);
    setOpenSections((previous) => [...previous, true]);
  };

  const removeSection = (index: number) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    if (sections.length <= 1) {
      toast.error("At least one section is required.");
      return;
    }
    sections.splice(index, 1);
    for (const [index_, s] of sections.entries()) s.order = index_;
    form.setData("sections", sections);
    setOpenSections((previous) => {
      const next = [...previous];
      next.splice(index, 1);
      return next;
    });
  };

  const addQuestion = (sectionIndex: number) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    const sec = sections[sectionIndex];
    sec.questions = [...sec.questions, defaultQuestion()];
    form.setData("sections", sections);
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    const sec = sections[sectionIndex];
    if (sec.questions.length <= 1) {
      toast.error("Each section must contain at least one question.");
      return;
    }
    sec.questions.splice(questionIndex, 1);
    form.setData("sections", sections);
  };

  const updateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    key: QuestionEditableKey,
    value: string | boolean | Record<string, unknown> | null,
  ) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    const sec = sections[sectionIndex];
    const q = sec.questions[questionIndex] as CreateQuestion;
    switch (key) {
      case "question_text": {
        q.question_text = String(value ?? "");
        break;
      }
      case "question_type": {
        q.question_type = (value as QuestionType) ?? "text";
        break;
      }
      case "required": {
        q.required = Boolean(value);
        break;
      }
      case "help_text": {
        q.help_text = typeof value === "string" ? value : "";
        break;
      }
      case "options": {
        const nextOptions: Record<string, unknown> | null =
          (value as Record<string, unknown>) ?? null;
        q.options = nextOptions;
        break;
      }
      default: {
        break;
      }
    }
    form.setData("sections", sections);
  };

  const addChoice = (sectionIndex: number, questionIndex: number, choice: string) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    const q = sections[sectionIndex].questions[questionIndex] as CreateQuestion;
    const current = ((q.options as Record<string, unknown> | null)?.choices as string[]) ?? [];
    const next = [...new Set([...(current ?? []), choice].filter(Boolean))];
    const nextOptions: Record<string, unknown> = {
      ...(q.options ?? ({} as Record<string, unknown>)),
      choices: next,
    };
    q.options = nextOptions;
    form.setData("sections", sections);
  };

  const removeChoice = (sectionIndex: number, questionIndex: number, choice: string) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    const q = sections[sectionIndex].questions[questionIndex] as CreateQuestion;
    const current = ((q.options as Record<string, unknown> | null)?.choices as string[]) ?? [];
    const nextOptions: Record<string, unknown> = {
      ...(q.options ?? ({} as Record<string, unknown>)),
      choices: current.filter((c) => c !== choice),
    };
    q.options = nextOptions;
    form.setData("sections", sections);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.post(ENDPOINTS.ADMIN.ONBOARDING_FORMS.STORE, {
      onSuccess: (response) => {
        toast.success(response.message);
        router.push(PATHS.ADMIN.ONBOARDING_FORMS.LIST);
      },
    });
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  const questionTypeOptions = QuestionTypeEnum.options.map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  }));

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Left column: Basics and actions */}
          <div className="space-y-5 rounded-md border border-gray-200 p-6 lg:sticky lg:top-24 lg:self-start lg:p-6">
            <InputField
              id="title"
              name="title"
              label="Form title"
              placeholder="e.g., Client Intake Questionnaire"
              value={String(form.data.title ?? "")}
              onChange={(event_) => form.setData("title", event_.target.value)}
              error={form.errors.title as string}
              required
            />

            <TextareaField
              id="description"
              name="description"
              label="Short description"
              placeholder="A concise summary to help admins identify this form"
              className="min-h-[92px]"
              value={String(form.data.description ?? "")}
              onChange={(event_) => form.setData("description", event_.target.value)}
              error={form.errors.description as string}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                id="status"
                name="status"
                label="Status"
                placeholder="Select status"
                options={statusOptions}
                value={form.data.status}
                onChange={(value) =>
                  form.setData("status", value as "draft" | "published" | "archived")
                }
                error={form.errors.status as string}
                required
              />

              <DatepickerField
                id="published_at"
                name="published_at"
                label="Published date"
                placeholder="Pick published date (optional)"
                value={(form.data.published_at as string | null) ?? undefined}
                onChange={(value) => form.setData("published_at", value)}
              />
            </div>

            {/* Summary */}
            <div className="bg-muted/30 rounded-md border border-dashed p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sections</span>
                <span className="text-foreground font-medium">
                  {(Array.isArray(form.data.sections) ? form.data.sections : []).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total questions</span>
                <span className="text-foreground font-medium">
                  {(Array.isArray(form.data.sections) ? form.data.sections : []).reduce(
                    (total, section) =>
                      total + (Array.isArray(section.questions) ? section.questions.length : 0),
                    0,
                  )}
                </span>
              </div>
            </div>

            <div className="hidden justify-start lg:flex">
              <Button
                type="submit"
                variant="default"
                disabled={form.processing}
                className="flex cursor-pointer items-center gap-2 font-semibold"
              >
                {form.processing ? "Creating..." : "Create Onboarding Form"}
              </Button>
            </div>
          </div>

          {/* Right column: Sections */}
          <div className="space-y-5 rounded-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">Sections</h3>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={addSection}
                className="flex cursor-pointer items-center gap-2"
              >
                <Plus className="h-3.5 w-3.5" /> Add section
              </Button>
            </div>

            {(Array.isArray(form.data.sections) ? form.data.sections : [])?.map(
              (section: CreateSection, sectionIndex: number) => (
                <Collapsible
                  key={sectionIndex}
                  open={openSections[sectionIndex] ?? true}
                  onOpenChange={(value) => {
                    setOpenSections((previous) => {
                      const next = [...previous];
                      next[sectionIndex] = Boolean(value);
                      return next;
                    });
                  }}
                  className="rounded-md border border-gray-200"
                >
                  <div className="bg-muted/40 flex items-center justify-between rounded-md px-4 py-3">
                    <div className="text-sm font-semibold">Section {sectionIndex + 1}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(sectionIndex)}
                        disabled={(form.data.sections as CreateSection[]).length <= 1}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove section"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Toggle section"
                        >
                          {(openSections[sectionIndex] ?? true) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="space-y-4 px-4 pb-5">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                          id={`section-${sectionIndex}-title`}
                          label="Section title"
                          placeholder="e.g., Personal Information"
                          value={String(section.title ?? "")}
                          onChange={(event_) => {
                            const sections = [
                              ...(((form.data.sections ??
                                []) as CreateOnboardingFormInput["sections"]) ?? []),
                            ];
                            sections[sectionIndex].title = event_.target.value;
                            form.setData("sections", sections);
                          }}
                        />
                        <InputField
                          id={`section-${sectionIndex}-description`}
                          label="Short description"
                          placeholder="Optional summary for this section"
                          value={String(section.description ?? "")}
                          onChange={(event_) => {
                            const sections = [
                              ...(((form.data.sections ??
                                []) as CreateOnboardingFormInput["sections"]) ?? []),
                            ];
                            sections[sectionIndex].description = event_.target.value;
                            form.setData("sections", sections);
                          }}
                        />
                      </div>

                      <Separator />
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Questions</h4>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addQuestion(sectionIndex)}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add question
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(Array.isArray(section.questions)
                          ? (section.questions as CreateQuestion[])
                          : []
                        ).map((q: CreateQuestion, questionIndex: number) => {
                          const choices =
                            ((q.options as Record<string, unknown> | null)?.choices as string[]) ??
                            [];
                          const canHaveChoices =
                            q.question_type === "select" || q.question_type === "multiselect";
                          return (
                            <div key={questionIndex} className="rounded-md border p-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-2">
                                  <InputField
                                    id={`q-${sectionIndex}-${questionIndex}-text`}
                                    label="Question"
                                    placeholder="Ask something..."
                                    value={String(q.question_text ?? "")}
                                    onChange={(event_) =>
                                      updateQuestion(
                                        sectionIndex,
                                        questionIndex,
                                        "question_text",
                                        event_.target.value,
                                      )
                                    }
                                    required
                                  />
                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {/* Type */}
                                    <ComboBoxField
                                      id={`q-${sectionIndex}-${questionIndex}-type`}
                                      label="Type"
                                      placeholder="Select question type"
                                      options={questionTypeOptions}
                                      value={q.question_type}
                                      onChange={(value) =>
                                        updateQuestion(
                                          sectionIndex,
                                          questionIndex,
                                          "question_type",
                                          value,
                                        )
                                      }
                                    />

                                    {/* Required */}
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Required</Label>
                                      <div className="flex h-11 items-center gap-2 rounded-md border px-3">
                                        <Checkbox
                                          checked={Boolean(q.required)}
                                          onCheckedChange={(value) =>
                                            updateQuestion(
                                              sectionIndex,
                                              questionIndex,
                                              "required",
                                              Boolean(value),
                                            )
                                          }
                                        />
                                        <span className="text-sm text-gray-700">
                                          This question is required
                                        </span>
                                      </div>
                                    </div>

                                    {/* Help text */}
                                    <InputField
                                      id={`q-${sectionIndex}-${questionIndex}-help`}
                                      label="Help text"
                                      placeholder="Optional hint to guide users"
                                      value={String(q.help_text ?? "")}
                                      onChange={(event_) =>
                                        updateQuestion(
                                          sectionIndex,
                                          questionIndex,
                                          "help_text",
                                          event_.target.value,
                                        )
                                      }
                                    />
                                  </div>

                                  {/* Choices for select/multiselect */}
                                  {canHaveChoices && (
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Choices</Label>
                                      <div className="flex flex-wrap items-center gap-2">
                                        {choices.map((c: string) => (
                                          <span
                                            key={c}
                                            className="bg-muted text-foreground inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium"
                                          >
                                            {c}
                                            <button
                                              type="button"
                                              aria-label="Remove choice"
                                              onClick={() =>
                                                removeChoice(sectionIndex, questionIndex, c)
                                              }
                                              className="text-muted-foreground hover:text-foreground"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <InputField
                                          id={`q-${sectionIndex}-${questionIndex}-new-choice`}
                                          placeholder="Add a choice and press Add"
                                          value={""}
                                          onChange={() => {}}
                                          // We use a controlled temp input below; keep this for consistent spacing
                                          containerClassName="hidden"
                                        />
                                        <AddChoiceInline
                                          onAdd={(value) =>
                                            addChoice(sectionIndex, questionIndex, value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuestion(sectionIndex, questionIndex)}
                                  disabled={(section.questions as CreateQuestion[]).length <= 1}
                                  className="hover:bg-destructive/10 hover:text-destructive mt-1 shrink-0"
                                  aria-label="Remove question"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ),
            )}
          </div>

          {/* close grid container */}
        </div>

        {/* mobile bottom action (kept for convenience) */}
        <div className="flex justify-end lg:hidden">
          <Button type="submit" variant="default" disabled={form.processing}>
            {form.processing ? "Creating..." : "Create Onboarding Form"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function AddChoiceInline({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = React.useState("");
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(event_) => setValue(event_.target.value)}
        placeholder="Add a choice and press Add"
        className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          const trimmed = value.trim();
          if (trimmed) onAdd(trimmed);
          setValue("");
        }}
        className="flex cursor-pointer items-center gap-2"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </Button>
    </div>
  );
}
