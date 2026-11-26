export type LessonQuizResult = {
  bestScore: number;
  lastScore: number;
  attempts: number;
  passed: boolean;
};

export type ProgressData = {
  completedLessons: string[];
  quizScores: number[];
  knownFlashcards: string[];
  practiceScores: number[];
  lessonQuizResults: Record<string, LessonQuizResult>;
};

const KEY = "balacoco-progress-v2";
const emptyProgress = (): ProgressData => ({
  completedLessons: [],
  quizScores: [],
  knownFlashcards: [],
  practiceScores: [],
  lessonQuizResults: {},
});

export function readProgress(): ProgressData {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      quizScores: Array.isArray(parsed.quizScores) ? parsed.quizScores : [],
      knownFlashcards: Array.isArray(parsed.knownFlashcards) ? parsed.knownFlashcards : [],
      practiceScores: Array.isArray(parsed.practiceScores) ? parsed.practiceScores : [],
      lessonQuizResults: parsed.lessonQuizResults && typeof parsed.lessonQuizResults === "object" ? parsed.lessonQuizResults : {},
    };
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(data: ProgressData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("balacoco-progress"));
}

export function completeLesson(id: string) {
  const data = readProgress();
  if (!data.completedLessons.includes(id)) data.completedLessons.push(id);
  writeProgress(data);
}

export function saveQuizScore(score: number) {
  const data = readProgress();
  data.quizScores.push(score);
  writeProgress(data);
}

export function saveLessonQuizResult(lessonId: string, score: number, passMark = 80) {
  const data = readProgress();
  const previous = data.lessonQuizResults[lessonId];
  data.lessonQuizResults[lessonId] = {
    bestScore: Math.max(previous?.bestScore ?? 0, score),
    lastScore: score,
    attempts: (previous?.attempts ?? 0) + 1,
    // Once a unit has been passed, it stays unlocked even if the learner retries it.
    passed: Boolean(previous?.passed) || score >= passMark,
  };
  data.quizScores.push(score);
  writeProgress(data);
}

export function markFlashcardKnown(id: string) {
  const data = readProgress();
  if (!data.knownFlashcards.includes(id)) data.knownFlashcards.push(id);
  writeProgress(data);
}

export function savePracticeScore(score: number) {
  const data = readProgress();
  data.practiceScores.push(score);
  writeProgress(data);
}
