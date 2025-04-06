"use client";
import React, { useEffect, useState } from "react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface PracticeExamProps {
  examData: { questions: Question[] };
  timeAllowed: number; // in minutes
  onExit: () => void;
}

export default function PracticeExam({
  examData,
  timeAllowed,
  onExit,
}: PracticeExamProps) {
  const [timer, setTimer] = useState(timeAllowed * 60);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (submitted || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, submitted]);

  const handleAnswerSelect = (index: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    examData.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleRetryExam = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimer(timeAllowed * 60);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Practice Exam</h2>
      <div className="mb-4">
        <p className="font-semibold">
          Time Remaining: {Math.floor(timer / 60)}:
          {("0" + (timer % 60)).slice(-2)}
        </p>
      </div>
      <ol className="space-y-6">
        {examData.questions.map((q, i) => (
          <li key={i} className="text-sm">
            <p className="font-semibold mb-2">
              {i + 1}. {q.question}
            </p>
            {q.options.length > 0 ? (
              <div className="space-y-2 ml-4">
                {q.options.map((option, j) => (
                  <div key={j} className="flex items-center">
                    <input
                      type="radio"
                      id={`q${i}-option${j}`}
                      name={`question-${i}`}
                      value={option}
                      checked={selectedAnswers[i] === option}
                      onChange={() => handleAnswerSelect(i, option)}
                      disabled={submitted}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`q${i}-option${j}`}
                      className={`${
                        submitted && option === q.answer
                          ? "text-green-600 font-medium"
                          : submitted &&
                            selectedAnswers[i] === option &&
                            option !== q.answer
                          ? "text-red-600 line-through"
                          : ""
                      }`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                placeholder="Type your answer here..."
                value={selectedAnswers[i] || ""}
                onChange={(e) => handleAnswerSelect(i, e.target.value)}
                disabled={submitted}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            )}
            {submitted && (
              <p
                className={`mt-2 ${
                  selectedAnswers[i] === q.answer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedAnswers[i] === q.answer
                  ? "✓ Correct!"
                  : `✗ Incorrect. Correct answer: ${q.answer}`}
              </p>
            )}
          </li>
        ))}
      </ol>
      {!submitted ? (
        <button
          onClick={handleSubmitExam}
          disabled={
            Object.keys(selectedAnswers).length !== examData.questions.length
          }
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          Submit Exam
        </button>
      ) : (
        <div className="mt-6">
          <p className="text-lg font-semibold">
            Your score: {score} out of {examData.questions.length} (
            {Math.floor((score / examData.questions.length) * 100)}%)
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Exit Exam
            </button>
            <button
              onClick={handleRetryExam}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Retry Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
