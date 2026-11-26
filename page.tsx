"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Lock,
  RotateCcw,
  Trophy,
  Unlock,
} from "lucide-react";
import { lessons } from "@/lib/data";
import { lessonQuizzes } from "@/lib/quiz-data";
import { readProgress, saveLessonQuizResult, type ProgressData } from "@/lib/progress";

const PASS_MARK = 80;
const QUESTION_COUNT = 5;
const digits = (value: number) => String(value).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
const initialProgress: ProgressData = {
  completedLessons: [],
  quizScores: [],
  knownFlashcards: [],
  practiceScores: [],
  lessonQuizResults: {},
};

export default function KuisPage() {
  const [progress, setProgress] = useState<ProgressData>(initialProgress);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastCorrectCount, setLastCorrectCount] = useState(0);
  const [lastPassed, setLastPassed] = useState(false);

  useEffect(() => {
    const update = () => setProgress(readProgress());
    update();
    window.addEventListener("balacoco-progress", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("balacoco-progress", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const passedCount = lessons.filter((lesson) => progress.lessonQuizResults[lesson.id]?.passed).length;
  const activeLessonIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const activeLesson = activeLessonIndex >= 0 ? lessons[activeLessonIndex] : null;
  const activeQuiz = useMemo(
    () => lessonQuizzes.find((quiz) => quiz.lessonId === activeLessonId),
    [activeLessonId],
  );
  const questions = activeQuiz?.questions ?? [];
  const question = questions[index];
  const correctCount = answers.reduce((sum, answer, answerIndex) => {
    return sum + (answer === questions[answerIndex]?.answer ? 1 : 0);
  }, 0);

  const isUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    return Boolean(progress.lessonQuizResults[lessons[lessonIndex - 1].id]?.passed);
  };

  const startQuiz = (lessonId: string) => {
    const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex < 0 || !isUnlocked(lessonIndex)) return;
    setActiveLessonId(lessonId);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setLastScore(null);
    setLastCorrectCount(0);
    setLastPassed(false);
  };

  const choose = (option: number) => {
    if (selected === null) setSelected(option);
  };

  const next = () => {
    if (selected === null || !question || !activeLessonId) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    if (index === questions.length - 1) {
      const totalCorrect = nextAnswers.reduce(
        (sum, answer, answerIndex) => sum + (answer === questions[answerIndex].answer ? 1 : 0),
        0,
      );
      const score = Math.round((totalCorrect / questions.length) * 100);
      const wasAlreadyPassed = Boolean(progress.lessonQuizResults[activeLessonId]?.passed);
      saveLessonQuizResult(activeLessonId, score, PASS_MARK);
      setProgress(readProgress());
      setLastScore(score);
      setLastCorrectCount(totalCorrect);
      setLastPassed(score >= PASS_MARK || wasAlreadyPassed);
      setFinished(true);
    } else {
      setIndex((current) => current + 1);
      setSelected(null);
    }
  };

  const nextLesson = activeLessonIndex >= 0 ? lessons[activeLessonIndex + 1] : undefined;

  return (
    <div className="container page-container arabic-page quiz-learning-page" dir="rtl" lang="ar">
      <div className="page-heading">
        <div>
          <span className="eyebrow">قِيَاسُ الْفَهْمِ وَالِاسْتِيعَابِ</span>
          <h1>اخْتِبَارَاتُ الْوَحَدَاتِ التَّدْرِيجِيَّةُ</h1>
          <p>أَتْمِمِ اخْتِبَارَ كُلِّ وَحْدَةٍ بِنَجَاحٍ لِتَفْتَحَ الِاخْتِبَارَ الَّذِي يَلِيهَا.</p>
        </div>
        <div className="heading-stat">
          <Trophy size={20} />
          <span><b>{digits(passedCount)} / {digits(lessons.length)}</b><small>وَحْدَاتٌ مُجْتَازَةٌ</small></span>
        </div>
      </div>

      <section className="quiz-rules-card">
        <div className="quiz-rules-icon"><Award size={21} /></div>
        <div>
          <b>نِظَامُ التَّقَدُّمِ وَشُرُوطُ النَّجَاحِ</b>
          <p>يَتَكَوَّنُ كُلُّ اخْتِبَارٍ مِنْ خَمْسَةِ أَسْئِلَةٍ. لِلِانْتِقَالِ إِلَى الْوَحْدَةِ التَّالِيَةِ، يَجِبُ أَنْ تَحْصُلَ عَلَى ٨٠٪ عَلَى الْأَقَلِّ، أَيْ أَرْبَعِ إِجَابَاتٍ صَحِيحَةٍ مِنْ خَمْسَةٍ.</p>
        </div>
        <div className="quiz-rules-score"><strong>{digits(PASS_MARK)}٪</strong><small>حَدُّ النَّجَاحِ</small></div>
      </section>

      <div className="quiz-level-heading">
        <div><span className="eyebrow">مَسَارُ التَّعَلُّمِ</span><h2>اخْتَرِ الْوَحْدَةَ لِبَدْءِ الِاخْتِبَارِ</h2></div>
        <span className="quiz-total-count"><CircleHelp size={16} /> {digits(lessons.length * QUESTION_COUNT)} سُؤَالًا</span>
      </div>

      <div className="quiz-level-list">
        {lessons.map((lesson, lessonIndex) => {
          const result = progress.lessonQuizResults[lesson.id];
          const unlocked = isUnlocked(lessonIndex);
          const passed = Boolean(result?.passed);
          const selectedLevel = activeLessonId === lesson.id;
          return (
            <article className={`quiz-level-card ${!unlocked ? "is-locked" : ""} ${passed ? "is-passed" : ""} ${selectedLevel ? "is-selected" : ""}`} key={lesson.id}>
              <div className="quiz-level-number">{passed ? <CheckCircle2 size={20} /> : !unlocked ? <Lock size={19} /> : <span>{digits(lessonIndex + 1)}</span>}</div>
              <div className="quiz-level-copy">
                <div className="quiz-level-title-row"><h3>{lesson.title}</h3><span className={`quiz-level-status ${passed ? "passed" : unlocked ? "available" : "locked"}`}>{passed ? "مُجْتَازٌ" : unlocked ? "مُتَاحٌ" : "مُغْلَقٌ"}</span></div>
                <p>{digits(QUESTION_COUNT)} أَسْئِلَةٍ · {digits(PASS_MARK)}٪ لِلنَّجَاحِ{result?.attempts ? ` · ${digits(result.attempts)} مُحَاوَلَاتٍ` : ""}</p>
                {result && <div className="quiz-level-score-line"><span>أَفْضَلُ نَتِيجَةٍ: {digits(result.bestScore)}٪</span><div className="quiz-level-mini-progress"><span style={{ width: `${result.bestScore}%` }} /></div></div>}
              </div>
              <button className={`button ${unlocked ? "button-primary" : "button-ghost"} quiz-level-action`} disabled={!unlocked} onClick={() => startQuiz(lesson.id)}>
                {unlocked ? passed ? "إِعَادَةُ الِاخْتِبَارِ" : "بَدْءُ الِاخْتِبَارِ" : "أَكْمِلِ السَّابِقَ"}
                {unlocked ? <Unlock size={15} /> : <Lock size={15} />}
              </button>
            </article>
          );
        })}
      </div>

      {activeLesson && activeQuiz && (
        <section className="quiz-session-section" id="quiz-session">
          <div className="quiz-session-heading">
            <div><span className="eyebrow">الِاخْتِبَارُ الْحَالِيُّ</span><h2>{activeLesson.title}</h2></div>
            <button className="text-button" onClick={() => setActiveLessonId(null)}>إِغْلَاقُ الِاخْتِبَارِ ×</button>
          </div>

          {finished ? (
            <div className="result-card lesson-quiz-result">
              <div className="result-icon">{lastPassed ? <Trophy size={34} /> : <BookOpen size={34} />}</div>
              <span className="eyebrow">نَتِيجَةُ اخْتِبَارِ الْوَحْدَةِ</span>
              <h1>{digits(lastScore ?? 0)}<small>٪</small></h1>
              <p className="result-score-label">مِنْ ١٠٠ دَرَجَةٍ</p>
              <h2>{lastPassed ? (lastScore !== null && lastScore >= PASS_MARK ? "أَحْسَنْتَ! لَقَدِ اجْتَزْتَ هَذِهِ الْوَحْدَةَ." : "أَنْتَ مُجْتَازٌ لِهَذِهِ الْوَحْدَةِ مِنْ مُحَاوَلَةٍ سَابِقَةٍ.") : "لَمْ تَصِلْ إِلَى حَدِّ النَّجَاحِ بَعْدُ."}</h2>
              <p>أَجَبْتَ إِجَابَةً صَحِيحَةً عَنْ <b>{digits(lastCorrectCount)} مِنْ {digits(QUESTION_COUNT)}</b> أَسْئِلَةٍ.</p>
              {lastPassed ? (
                <div className="quiz-unlock-message"><CheckCircle2 size={18} /><span>{nextLesson ? `فُتِحَ لَكَ اخْتِبَارُ الْوَحْدَةِ التَّالِيَةِ: ${nextLesson.title}` : "لَقَدْ أَتْمَمْتَ جَمِيعَ اخْتِبَارَاتِ الْمَوَادِّ!"}</span></div>
              ) : (
                <div className="quiz-retry-message">تَحْتَاجُ إِلَى أَرْبَعِ إِجَابَاتٍ صَحِيحَةٍ عَلَى الْأَقَلِّ. رَاجِعِ الْمَادَّةَ ثُمَّ حَاوِلْ مَرَّةً أُخْرَى.</div>
              )}
              <div className="result-actions">
                <button className="button button-primary" onClick={() => startQuiz(activeLesson.id)}><RotateCcw size={16} /> إِعَادَةُ الِاخْتِبَارِ</button>
                {lastPassed && nextLesson && (
                  <button className="button button-ghost" onClick={() => startQuiz(nextLesson.id)}>الِانْتِقَالُ إِلَى الْوَحْدَةِ التَّالِيَةِ <ArrowLeft size={16} /></button>
                )}
                {lastPassed && !nextLesson && <a className="button button-ghost" href="/progres">عَرْضُ التَّقَدُّمِ <ArrowLeft size={16} /></a>}
              </div>
            </div>
          ) : question ? (
            <div className="quiz-card">
              <div className="quiz-topline"><span>السُّؤَالُ {digits(index + 1)} <small>/ {digits(QUESTION_COUNT)}</small></span><span>{digits(Math.round((index / QUESTION_COUNT) * 100))}٪ مُكْتَمِلٌ</span></div>
              <div className="quiz-progress"><span style={{ width: `${((index + (selected !== null ? 1 : 0)) / QUESTION_COUNT) * 100}%` }} /></div>
              <h2>{question.question}</h2>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => {
                  const isChosen = selected === optionIndex;
                  const isCorrect = selected !== null && optionIndex === question.answer;
                  const isWrong = isChosen && optionIndex !== question.answer;
                  return (
                    <button key={`${index}-${optionIndex}`} className={`quiz-option ${isChosen ? "chosen" : ""} ${selected !== null && isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => choose(optionIndex)} disabled={selected !== null}>
                      <span className="option-letter">{"أبجد"[optionIndex]}</span><span>{option}</span>{selected !== null && isCorrect && <CheckCircle2 size={18} />}
                    </button>
                  );
                })}
              </div>
              {selected !== null && <div className={`answer-feedback ${selected === question.answer ? "feedback-correct" : "feedback-wrong"}`}><b>{selected === question.answer ? "إِجَابَةٌ صَحِيحَةٌ!" : "إِجَابَةٌ غَيْرُ صَحِيحَةٍ."}</b><p>{question.explanation}</p></div>}
              <div className="quiz-footer"><span>{selected === null ? "اخْتَرِ الْإِجَابَةَ الْأَصَحَّ مِنَ الْخِيَارَاتِ." : "اقْرَأِ التَّعْلِيلَ ثُمَّ انْتَقِلْ إِلَى السُّؤَالِ التَّالِي."}</span><button className="button button-primary" disabled={selected === null} onClick={next}>{index === QUESTION_COUNT - 1 ? "إِنْهَاءُ الِاخْتِبَارِ" : "السُّؤَالُ التَّالِي"} <ArrowLeft size={16} /></button></div>
            </div>
          ) : null}
        </section>
      )}

      {passedCount === lessons.length && <div className="all-quizzes-complete"><Trophy size={22} /><div><b>مُبَارَكٌ! أَتْمَمْتَ جَمِيعَ الِاخْتِبَارَاتِ.</b><p>لَقَدْ اجْتَزْتَ اخْتِبَارَاتِ الْوَحَدَاتِ التِّسْعِ كُلَّهَا.</p></div></div>}

      <p className="page-footnote">تُحْفَظُ دَرَجَاتُ كُلِّ وَحْدَةٍ فِي هَذَا الْمُتَصَفِّحِ. وَيَبْقَى الِاخْتِبَارُ التَّالِي مُغْلَقًا حَتَّى تَحْصُلَ عَلَى ٨٠٪ عَلَى الْأَقَلِّ فِي الِاخْتِبَارِ السَّابِقِ.</p>
    </div>
  );
}
