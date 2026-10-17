import { memo, useId } from 'react';

interface Question {
  question?: string;
  answer?: string;
}

export interface QuestionsData {
  title?: string;
  questions?: Question[];
  [key: string]: unknown;
}

/**
 * `questions` home block — a two-column FAQ accordion. The open/close behaviour
 * is pure CSS (`.tab`, `04-components/faq.scss`) driven by a checkbox, as in the
 * Twig theme's `home/questions.twig`; answers are merchant HTML.
 */
export const Questions = memo(function Questions({ data }: { data: QuestionsData }) {
  const uid = useId();
  const { title, questions = [] } = data;

  if (!questions.length) return null;

  return (
    <div className="container">
      {title ? (
        <div className="s-block__title">
          <div className="right-side">
            <h2>{title}</h2>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {questions.map((question, index) => {
          const id = `${uid}-accordion-${index}`;
          return (
            <div key={index} className="tab group">
              <input type="checkbox" name={uid} id={id} readOnly />
              <label htmlFor={id} className="tab__label no-select">
                <p>{question.question}</p>
                <i className="group-hover:-translate-y-1 transition text-lg sicon-keyboard_arrow_down" />
              </label>
              <div
                className="tab__content"
                // Merchant-authored rich text, as in Twig.
                dangerouslySetInnerHTML={{ __html: question.answer || '' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});
