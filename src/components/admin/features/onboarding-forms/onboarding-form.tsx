/* eslint-disable unicorn/no-null */
"use client";

import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import InputField from "@/components/shared/forms/input-field";
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
import { OnboardingForm as OnboardingFormType } from "@/types/admin/onboarding-form";

export default function OnboardingFormCreateForm({
  onboardingForm,
}: {
  onboardingForm?: OnboardingFormType;
}) {
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

  // When editing, prefill the form with existing values
  React.useEffect(() => {
    if (!onboardingForm) return;

    const mappedSections: CreateOnboardingFormInput["sections"] = Array.isArray(
      onboardingForm.sections,
    )
      ? onboardingForm.sections.map((s, index) => ({
          title: String((s as unknown as { title?: unknown }).title ?? ""),
          description: String((s as unknown as { description?: unknown }).description ?? ""),
          order: Number((s as unknown as { order?: unknown }).order ?? index) || index,
          questions: Array.isArray((s as unknown as { questions?: unknown }).questions as unknown[])
            ? (((s as unknown as { questions?: unknown }).questions as unknown[]) ?? []).map(
                (q) => {
                  const question = (q ?? {}) as Record<string, unknown>;
                  const rawOptions = question.options as unknown;
                  const optionsArray = Array.isArray(rawOptions)
                    ? (rawOptions.filter((c) => typeof c === "string") as string[])
                    : null;
                  return {
                    question_text: String(
                      (question.question_text as string | undefined) ??
                        (question.question as string | undefined) ??
                        "",
                    ),
                    question_type: String(
                      (question.question_type as string | undefined) ??
                        (question.type as string | undefined) ??
                        "text",
                    ),
                    required: Boolean((question.required as boolean | undefined) ?? true),
                    help_text: String((question.help_text as string | undefined) ?? ""),
                    options: optionsArray,
                  } as CreateQuestion;
                },
              )
            : [],
        }))
      : [];

    const nextData: CreateOnboardingFormInput = {
      title: String(onboardingForm.title ?? ""),
      description: String(onboardingForm.description ?? ""),
      status: (onboardingForm.status as "draft" | "published" | "archived") ?? "draft",
      published_at: onboardingForm.published_at ?? null,
      sections: mappedSections,
    };

    form.setDataAndDefaults(nextData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingForm]);

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
    value: string | boolean | string[] | null,
  ) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    const sec = sections[sectionIndex];
    const q = sec.questions[questionIndex] as CreateQuestion & { options?: unknown };
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
        const nextOptions: string[] | null = (value as string[] | null) ?? null;
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
    const q = sections[sectionIndex].questions[questionIndex] as CreateQuestion & {
      options?: unknown;
    };
    const current = (Array.isArray(q.options) ? (q.options as unknown[]) : [])
      .filter((c) => typeof c === "string")
      .map(String) as string[];
    const next = [...new Set([...(current ?? []), choice].filter(Boolean))];
    q.options = next;
    form.setData("sections", sections);
  };

  const removeChoice = (sectionIndex: number, questionIndex: number, choice: string) => {
    const sections = [
      ...(((form.data.sections ?? []) as CreateOnboardingFormInput["sections"]) ?? []),
    ];
    const q = sections[sectionIndex].questions[questionIndex] as CreateQuestion & {
      options?: unknown;
    };
    const current = (Array.isArray(q.options) ? (q.options as unknown[]) : [])
      .filter((c) => typeof c === "string")
      .map(String) as string[];
    q.options = current.filter((c) => c !== choice);
    form.setData("sections", sections);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isEdit = Boolean(onboardingForm?.id);
    if (isEdit && onboardingForm?.id) {
      form.put(ENDPOINTS.ADMIN.ONBOARDING_FORMS.UPDATE(onboardingForm.id), {
        onSuccess: (response) => {
          toast.success(response.message);
          router.push(PATHS.ADMIN.ONBOARDING_FORMS.LIST);
        },
      });
    } else {
      form.post(ENDPOINTS.ADMIN.ONBOARDING_FORMS.STORE, {
        onSuccess: (response) => {
          toast.success(response.message);
          router.push(PATHS.ADMIN.ONBOARDING_FORMS.LIST);
        },
      });
    }
  };

  const questionTypeOptions = QuestionTypeEnum.options.map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  }));

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-md border border-gray-200 p-6">
        {/* Basics */}
        <div className="space-y-5">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">
              Basic information
            </h3>
            <p className="text-sm text-gray-500">
              Provide concise details that help admins identify and manage this onboarding form.
            </p>
          </div>
          <div className="space-y-5">
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
          </div>
        </div>

        <Separator />

        {/* Sections */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">Sections</h3>
              <p className="text-sm text-gray-500">
                Structure your form into logical groups for clarity and better completion rates.
              </p>
            </div>
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
                className="overflow-hidden rounded-md border border-gray-200"
              >
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
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
                      <Button type="button" variant="ghost" size="icon" aria-label="Toggle section">
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
                  <div className="space-y-4 px-4 py-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                        error={form.errors[`sections.${sectionIndex}.title`] as string}
                        required
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
                        error={form.errors[`sections.${sectionIndex}.description`] as string}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">
                          Questions
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add questions to your form to collect information from your users.
                        </p>
                      </div>
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

                    <div className="space-y-5">
                      {(Array.isArray(section.questions)
                        ? (section.questions as CreateQuestion[])
                        : []
                      ).map((q: CreateQuestion, questionIndex: number) => {
                        const choices = Array.isArray(q.options)
                          ? (q.options.filter((c) => typeof c === "string") as string[])
                          : [];
                        const canHaveChoices =
                          q.question_type === "select" || q.question_type === "multiselect";
                        return (
                          <div key={questionIndex} className="space-y-4">
                            <div className="flex items-start gap-5">
                              <div className="flex-1 space-y-4">
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
                                  error={
                                    form.errors[
                                      `sections.${sectionIndex}.questions.${questionIndex}.question_text`
                                    ] as string
                                  }
                                />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    error={
                                      form.errors[
                                        `sections.${sectionIndex}.questions.${questionIndex}.question_type`
                                      ] as string
                                    }
                                    required
                                  />

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
                                    error={
                                      form.errors[
                                        `sections.${sectionIndex}.questions.${questionIndex}.help_text`
                                      ] as string
                                    }
                                  />
                                </div>

                                {/* Toolbar: Required + Delete */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
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
                                    <Label className="text-sm leading-none font-medium">
                                      This question is required
                                    </Label>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeQuestion(sectionIndex, questionIndex)}
                                    disabled={(section.questions as CreateQuestion[]).length <= 1}
                                    className="hover:bg-destructive/10 hover:text-destructive"
                                    aria-label="Remove question"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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
                                      <AddChoiceInline
                                        onAdd={(value) =>
                                          addChoice(sectionIndex, questionIndex, value)
                                        }
                                      />
                                      {(form.errors[
                                        `sections.${sectionIndex}.questions.${questionIndex}.options`
                                      ] as string) && (
                                        <p className="text-sm font-medium text-red-600">
                                          {
                                            form.errors[
                                              `sections.${sectionIndex}.questions.${questionIndex}.options`
                                            ] as string
                                          }
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {questionIndex <
                              (Array.isArray(section.questions) ? section.questions.length : 0) -
                                1 && <Separator />}
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

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            variant="default"
            disabled={form.processing || (Boolean(onboardingForm?.id) && !form.isDirty)}
            className="flex cursor-pointer items-center gap-2 font-semibold"
          >
            {form.processing
              ? onboardingForm?.id
                ? "Saving..."
                : "Creating..."
              : onboardingForm?.id
                ? "Save Changes"
                : "Create Onboarding Form"}
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
