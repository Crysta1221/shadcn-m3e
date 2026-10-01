import * as React from "react"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/m3e/questionnaire"

export const meta = {
  title: "Three questions",
  description:
    "One question at a time: a single choice, several choices and a free answer. Answers come out as form data.",
  layout: "block",
}

export default function Demo() {
  const [answers, setAnswers] = React.useState<string | null>(null)

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Questionnaire
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setAnswers(
            JSON.stringify(
              {
                framework: data.get("framework"),
                tools: data.getAll("tools"),
                note: data.get("note"),
              },
              null,
              2
            )
          )
        }}
      >
        <QuestionnaireProgress />

        <QuestionnaireItem name="framework" required>
          <QuestionnaireTitle>Which framework do you use?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick one.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="react">React</QuestionnaireChoice>
            <QuestionnaireChoice value="svelte">Svelte</QuestionnaireChoice>
            <QuestionnaireChoice value="vue">Vue</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError>Choose one to continue.</QuestionnaireError>
        </QuestionnaireItem>

        <QuestionnaireItem name="tools" multiple>
          <QuestionnaireTitle>Which tools help?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick any number.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="tailwind">
              Tailwind CSS
            </QuestionnaireChoice>
            <QuestionnaireChoice value="vite">Vite</QuestionnaireChoice>
            <QuestionnaireChoice value="bun">Bun</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>

        <QuestionnaireItem name="note">
          <QuestionnaireTitle>Anything else?</QuestionnaireTitle>
          <QuestionnaireInput placeholder="Optional" />
        </QuestionnaireItem>

        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>

      {answers && (
        <pre className="rounded-md bg-surface-container-highest p-3 font-mono text-body-small text-on-surface">
          {answers}
        </pre>
      )}
    </div>
  )
}
