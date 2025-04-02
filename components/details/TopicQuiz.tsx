"use client";
import { useEffect, useState } from "react";
import { fetchAIResponse } from "@/lib/openaiClient"; // ensure this file exports fetchAIResponse properly

export function TopicQuiz({ notesContent }: { notesContent: string }) {
  const [aiOutput, setAiOutput] = useState<string>("");
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
    async function getResponse() {
      try {
        const response = await fetchAIResponse(notesContent);
        console.log("Raw AI Output:", response); // Log the raw output
        const cleanResponse = cleanJSON(response);
        setAiOutput(cleanResponse);

        try {
          const parsed = JSON.parse(cleanResponse);
          console.log("Parsed AI Response:", parsed);
          // If parsed is an array, use it directly.
          if (Array.isArray(parsed)) {
            setQuestions(parsed);
          } else if (parsed.questions) {
            setQuestions(parsed.questions);
          } else {
          }
        } catch (error) {
          console.error("Error parsing AI response:", error);
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        setLoading(false);
      }
    }

    // Reset state when notes content changes
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);

    getResponse();
  }, [notesContent]);

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
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="w-full p-4">
      <h3 className="text-xl font-semibold mb-4">Topic Quiz</h3>

      {loading ? (
        <p className="mt-4">Loading quiz questions...</p>
      ) : (
        <div className="mt-4 border p-4 rounded bg-gray-50 dark:bg-neutral-800">
          {questions.length > 0 ? (
            <>
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
                  disabled={
                    Object.keys(selectedAnswers).length !== questions.length
                  }
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
            </>
          ) : (
            <p className="text-sm">No questions available.</p>
          )}
        </div>
      )}
    </div>
  );
}
