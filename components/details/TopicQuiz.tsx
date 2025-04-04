"use client";
import React, { useEffect, useState } from "react";
import { fetchAIResponse } from "@/lib/openaiClient"; // ensure this file exports fetchAIResponse properly

interface TopicQuizProps {
  notesContent: string;
  storedQuizData?: any; // previously generated quiz data from Firestore
  storedAnswers?: Record<number, string>; // previously selected answers
  storedScore?: number; // previously saved score
  storedTotal?: number; // previously saved total questions
  onQuizGenerated: (quizData: any) => void; // callback to store quiz data in Firestore
  onQuizSubmit: (
    quizAnswers: Record<number, string>,
    score: number,
    total: number
  ) => void;
}

export function TopicQuiz({
  notesContent,
  storedQuizData,
  storedAnswers,
  storedScore,
  storedTotal,
  onQuizGenerated,
  onQuizSubmit,
}: TopicQuizProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Function to clean code fences from the response
  function cleanJSON(response: string): string {
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "");
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/\s*```$/, "");
    }
    return cleaned;
  }

  useEffect(() => {
    async function initQuiz() {
      if (storedQuizData && Array.isArray(storedQuizData)) {
        // Use the stored quiz data, and if there are stored answers, show results.
        setQuestions(storedQuizData);
        if (storedAnswers && Object.keys(storedAnswers).length > 0) {
          setSelectedAnswers(storedAnswers);
          setShowResults(true);
          if (
            typeof storedScore === "number" &&
            typeof storedTotal === "number"
          ) {
            setScore(storedScore);
          }
        }
        setLoading(false);
      } else {
        // No stored quiz, so generate a new one.
        try {
          const response = await fetchAIResponse(notesContent);
          console.log("Raw AI Output:", response);
          const cleanResponse = cleanJSON(response);
          let quiz: any[] = [];
          try {
            const parsed = JSON.parse(cleanResponse);
            if (Array.isArray(parsed)) {
              quiz = parsed;
            } else if (parsed.questions) {
              quiz = parsed.questions;
            }
          } catch (err) {
            console.error("Error parsing AI response:", err);
          }
          setQuestions(quiz);
          onQuizGenerated(quiz); // store quiz data in Firestore
        } catch (err) {
          console.error("Error fetching AI response:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    initQuiz();
  }, [
    notesContent,
    storedQuizData,
    storedAnswers,
    storedScore,
    storedTotal,
    onQuizGenerated,
  ]);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
    onQuizSubmit(selectedAnswers, correctAnswers, questions.length);
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return <p>Loading quiz questions...</p>;
  }

  if (!questions || questions.length === 0) {
    return <p>No questions available.</p>;
  }

  return (
    <div className="mt-4 border p-4 rounded bg-gray-50 dark:bg-neutral-800">
      <ol className="space-y-6">
        {questions.map((q, i) => (
          <li key={i} className="text-sm">
            <p className="font-semibold mb-2">
              {i + 1}. {q.question}
            </p>
            <div className="space-y-2 ml-4">
              {q.options.map((option: string, j: number) => (
                <div key={j} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${i}-option${j}`}
                    name={`question-${i}`}
                    value={option}
                    checked={selectedAnswers[i] === option}
                    onChange={() => handleAnswerSelect(i, option)}
                    disabled={showResults}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`q${i}-option${j}`}
                    className={`${
                      showResults && option === q.answer
                        ? "text-green-600 font-medium"
                        : showResults &&
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
            {showResults && (
              <p
                className={`mt-2 ${
                  selectedAnswers[i] === q.answer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedAnswers[i] === q.answer
                  ? "✓ Correct!"
                  : `✗ Incorrect. The correct answer is: ${q.answer}`}
              </p>
            )}
          </li>
        ))}
      </ol>

      {!showResults ? (
        <button
          onClick={handleSubmitQuiz}
          disabled={Object.keys(selectedAnswers).length !== questions.length}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-6">
          <p className="text-lg font-semibold">
            Your score: {score} out of {questions.length} (
            {Math.round((score / questions.length) * 100)}%)
          </p>
          <button
            onClick={handleRetryQuiz}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
}
