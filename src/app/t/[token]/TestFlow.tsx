"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  createSession,
  submitAnswers,
  shouldShowProfileField,
  type SessionData,
  type DeepDiveQuestion,
  type ProfileField,
} from "@/lib/engine-api";
import { getDimensionTheme, getPoolTheme, getDimensionLabel, getPoolLabel } from "@/lib/dimension-colors";
import { AnalysisSubmitted } from "@/components/test/AnalysisSubmitted";
import { PreparationScreen } from "@/components/test/PreparationScreen";
import { JourneyMap } from "@/components/test/JourneyMap";
import { StageIntro } from "@/components/test/StageIntro";
import { StageCompletion } from "@/components/test/StageCompletion";
import {
  ScaleQuestion,
  SingleChoiceQuestion,
  MultiSelectQuestion,
  BooleanQuestion,
  NumericQuestion,
  TextQuestion,
} from "@/components/test/QuestionTypes";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { ChevronLeft, Activity, Sparkles } from "lucide-react";
import { celebrateCompletion } from "@/lib/confetti";
import { celebrationPop } from "@/lib/animations";

// Normalize options from various DB formats to { label, value } format
function normalizeOptions(options: unknown[]): { label: string; value: string | number | boolean }[] {
  if (!options || !Array.isArray(options)) return [];
  
  return options.map((opt, index) => {
    // String format: ["option1", "option2"]
    if (typeof opt === "string") {
      return { label: opt, value: opt };
    }
    // Object format with text: { text: "Label", value: 1 }
    if (typeof opt === "object" && opt !== null) {
      const obj = opt as Record<string, unknown>;
      const label = (obj.label ?? obj.text ?? `Option ${index + 1}`) as string;
      const value = obj.value ?? index;
      return { label, value: value as string | number | boolean };
    }
    // Fallback
    return { label: String(opt), value: index };
  });
}

type Phase =
  | "loading"
  | "preparation"
  | "journey_map"
  | "stage_intro"
  | "profile"
  | "stage_complete"
  | "core"
  | "deep_dive"
  | "submitting"
  | "submitted"
  | "done"
  | "error";

interface TestFlowProps {
  token: string;
  clientName?: string;
}

// Page types for unified navigation
type PageItem =
  | { type: "profile"; field: ProfileField; index: number }
  | { type: "core"; question: SessionData["core_questions"][0]; index: number }
  | { type: "deep_dive"; question: DeepDiveQuestion; index: number };

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

function CompletionScreen() {
  useEffect(() => {
    celebrateCompletion();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4 pb-safe">
      <motion.div
        variants={celebrationPop}
        initial="initial"
        animate="animate"
        className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#5B7B6A]/30"
        >
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          Tebrikler!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-1"
        >
          Analiziniz başarıyla tamamlandı.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-sm"
        >
          Sonuçlarınız uzmanınızla paylaşılacaktır.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-gray-100"
        >
          <p className="text-xs text-gray-300 font-medium tracking-wider uppercase">Powered by Orbira</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function TestFlow({ token, clientName }: TestFlowProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [deepDiveQuestions, setDeepDiveQuestions] = useState<DeepDiveQuestion[]>([]);

  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const [coreAnswers, setCoreAnswers] = useState<Record<string, number>>({});
  const [deepDiveAnswers, setDeepDiveAnswers] = useState<Record<string, number | string | string[]>>({});

  // Refs to always have latest answers for submit (React state batching fix)
  const coreAnswersRef = useRef<Record<string, number>>({});
  const deepDiveAnswersRef = useRef<Record<string, number | string | string[]>>({});
  useEffect(() => {
    coreAnswersRef.current = coreAnswers;
  }, [coreAnswers]);
  useEffect(() => {
    deepDiveAnswersRef.current = deepDiveAnswers;
  }, [deepDiveAnswers]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Stage tracking
  const [currentStage, setCurrentStage] = useState(0);

  // Build pages based on current phase - with conditional filtering for profile fields
  const pages: PageItem[] = useMemo(() => {
    if (!sessionData) return [];

    if (phase === "profile") {
      // Filter profile fields based on conditions
      const visibleFields = sessionData.profile_fields.filter((field) =>
        shouldShowProfileField(field, profile)
      );
      return visibleFields.map((field, index) => ({
        type: "profile" as const,
        field,
        index,
      }));
    }

    if (phase === "core") {
      return sessionData.core_questions.map((question, index) => ({
        type: "core" as const,
        question,
        index,
      }));
    }

    if (phase === "deep_dive") {
      return deepDiveQuestions.map((question, index) => ({
        type: "deep_dive" as const,
        question,
        index,
      }));
    }

    return [];
  }, [sessionData, deepDiveQuestions, phase, profile]);

  const currentPage = pages[currentIndex];
  const totalPages = pages.length;

  useEffect(() => {
    initSession();
  }, []);

  async function initSession() {
    try {
      const data = await createSession(token);
      setSessionId(data.session_id);
      setSessionData(data);
      setPhase("preparation");
    } catch (e) {
      console.error("Session init error:", e);
      setError("Bağlantı hatası oluştu. Lütfen sayfayı yenileyin.");
      setPhase("error");
    }
  }

  // Navigation helpers
  const goNext = useCallback(() => {
    if (currentIndex < totalPages - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, totalPages]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  // Stage transition handlers
  function handlePreparationContinue() {
    setPhase("journey_map");
  }

  function handleJourneyMapStart() {
    setCurrentStage(1);
    setPhase("stage_intro");
  }

  function handleStageIntroStart() {
    setCurrentIndex(0);
    if (currentStage === 1) {
      setPhase("profile");
    } else if (currentStage === 2) {
      setPhase("core");
    } else if (currentStage === 3) {
      setPhase("deep_dive");
    }
  }

  function handleStageCompleteContinue() {
    if (currentStage === 1) {
      // Stage 1 (profil) bitti, Stage 2'ye (core) geç
      setCurrentStage(2);
      setPhase("stage_intro");
    } else if (currentStage === 2) {
      // Stage 2 (core) bitti, şimdi profil + core cevaplarını gönder
      handleProfileSubmit();
    }
  }

  function getStageIntroContent(): { title: string; subtitle: string } {
    switch (currentStage) {
      case 1:
        return {
          title: "Temel Bilgiler",
          subtitle: "Seni tanımak için demografik ve yaşam tarzı bilgileriyle başlıyoruz.",
        };
      case 2:
        return {
          title: "Çekirdek Analiz",
          subtitle: "Kişilik özelliklerini ve davranış kalıplarını anlamamıza yardımcı ol.",
        };
      case 3:
        return {
          title: "Derinlemesine Keşif",
          subtitle: "Son aşama! Sana özel detaylı sorularla bitiriyoruz.",
        };
      default:
        return { title: "Devam", subtitle: "Bir sonraki adıma geçiyoruz." };
    }
  }

  // Apply skip default values for fields that should be skipped
  const applySkipDefaults = useCallback((currentProfile: Record<string, unknown>) => {
    if (!sessionData) return currentProfile;
    
    const updatedProfile = { ...currentProfile };
    for (const field of sessionData.profile_fields) {
      // If field should be skipped and has a default value, apply it
      if (!shouldShowProfileField(field, currentProfile) && field.skip_default_value != null) {
        if (updatedProfile[field.id] === undefined) {
          updatedProfile[field.id] = field.skip_default_value;
        }
      }
    }
    return updatedProfile;
  }, [sessionData]);

  // Answer handlers
  function handleProfileAnswer(fieldId: string, value: unknown) {
    setProfile((prev) => {
      const newProfile = { ...prev, [fieldId]: value };
      // Apply skip defaults after each answer (in case conditions changed)
      return applySkipDefaults(newProfile);
    });
  }

  function handleProfileAnswerAndNext(fieldId: string, value: unknown) {
    handleProfileAnswer(fieldId, value);
    setTimeout(() => {
      if (currentIndex < totalPages - 1) {
        goNext();
      } else {
        // Profile complete
        setPhase("stage_complete");
      }
    }, 300);
  }

  function handleCoreAnswer(questionId: string, value: number) {
    const newAnswers = { ...coreAnswers, [questionId]: value };
    setCoreAnswers(newAnswers);

    // Midway motivation removed - continue directly to next question

    setTimeout(() => {
      if (currentIndex < totalPages - 1) {
        goNext();
      } else {
        // Core complete
        setPhase("stage_complete");
      }
    }, 400);
  }

  function handleDeepDiveAnswer(questionId: string, value: number | string | string[]) {
    setDeepDiveAnswers((prev) => ({ ...prev, [questionId]: value }));

    setTimeout(() => {
      if (currentIndex < totalPages - 1) {
        goNext();
      } else {
        // Deep dive complete
        setPhase("stage_complete");
      }
    }, 400);
  }

  function handleProfileNext() {
    const currentField = sessionData?.profile_fields[currentIndex];
    if (!currentField) return;

    const val = profile[currentField.id];
    if (currentField.required !== false) {
      if (val == null) {
        setError("Lütfen bu alanı doldurun.");
        return;
      }
      if (currentField.answer_type === "multi_select" && Array.isArray(val) && val.length === 0) {
        setError("Lütfen en az bir seçenek seçin.");
        return;
      }
    }

    setError(null);

    if (currentIndex < totalPages - 1) {
      goNext();
    } else {
      setPhase("stage_complete");
    }
  }

  async function handleProfileSubmit() {
    // Bu fonksiyon Stage 2 (core) tamamlandığında çağrılır
    // Profil + Core cevaplarını birlikte gönderir
    if (!sessionId || !sessionData) return;

    setError(null);
    setPhase("loading");

    try {
      const statusRes = await fetch("/api/test/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          status: "started",
          session_id: sessionId,
        }),
      });

      if (!statusRes.ok) {
        console.error("Test başlangıcı kaydedilemedi");
      }

      const data = await submitAnswers(sessionId, profile, coreAnswersRef.current, {}, token);
      setDeepDiveQuestions(data.deep_dive_questions);
      setDirection(1);
      setCurrentIndex(0);
      setCurrentStage(3);
      setPhase("stage_intro");
    } catch (e) {
      console.error("Submit answers error:", e);
      setError("Cevaplar gönderilemedi. Lütfen tekrar deneyin.");
      setPhase("core");
    }
  }

  async function handleFinalAnalysis() {
    if (!sessionId) return;

    setPhase("submitting");
    setError(null);

    try {
      const response = await fetch("/api/test/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          token,
          session_id: sessionId,
          deep_dive_answers: deepDiveAnswersRef.current,
        }),
      });

      const responseData = (await response.json().catch(() => null)) as
        | { error?: string; status?: string }
        | null;

      if (!response.ok) {
        throw new Error(responseData?.error ?? "Yanıtlarınız gönderilemedi.");
      }

      if (responseData?.status === "completed") {
        setPhase("done");
        return;
      }

      setPhase("submitted");
    } catch (e) {
      console.error("Final submission error:", e);
      setError("Yanıtlarınız gönderilemedi. Lütfen tekrar deneyin.");
      setPhase("error");
    }
  }

  // Progress calculation
  function getProgress(): { current: number; total: number; label: string; subProgress: number } {
    const profileCount = sessionData?.profile_fields.length || 0;
    const coreCount = sessionData?.core_questions.length || 0;
    const deepDiveCount = deepDiveQuestions.length;

    switch (phase) {
      case "profile":
        return {
          current: 1,
          total: 3,
          label: "Profil",
          subProgress: totalPages > 0 ? ((currentIndex + 1) / totalPages) * 100 : 0,
        };
      case "core":
        return {
          current: 2,
          total: 3,
          label: "Değerlendirme",
          subProgress: totalPages > 0 ? ((currentIndex + 1) / totalPages) * 100 : 0,
        };
      case "deep_dive":
        return {
          current: 3,
          total: 3,
          label: "Derinlemesine",
          subProgress: totalPages > 0 ? ((currentIndex + 1) / totalPages) * 100 : 0,
        };
      default:
        return { current: 0, total: 3, label: "", subProgress: 0 };
    }
  }

  // Full-screen states
  if (phase === "loading") {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4 pb-safe">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-14 h-14 border-[3px] border-[#5B7B6A] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="text-gray-500 font-medium">Hazırlanıyor...</p>
        </motion.div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4 pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full min-h-[52px] px-8 py-3 bg-[#5B7B6A] text-white rounded-2xl font-semibold hover:bg-[#4A6A59] transition-all active:scale-[0.98] shadow-lg shadow-[#5B7B6A]/20 touch-manipulation"
          >
            Sayfayı Yenile
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === "submitting") {
    return <AnalysisSubmitted state="submitting" />;
  }

  if (phase === "submitted") {
    return <AnalysisSubmitted state="processing" />;
  }

  if (phase === "preparation") {
    return (
      <PreparationScreen
        clientName={clientName}
        onContinue={handlePreparationContinue}
      />
    );
  }

  if (phase === "journey_map" && sessionData) {
    return (
      <JourneyMap
        profileGroupCount={sessionData.profile_fields.length}
        coreQuestionCount={sessionData.core_questions.length}
        onStart={handleJourneyMapStart}
      />
    );
  }

  if (phase === "stage_intro") {
    const { title, subtitle } = getStageIntroContent();
    return (
      <StageIntro
        stageNumber={currentStage}
        title={title}
        subtitle={subtitle}
        onStart={handleStageIntroStart}
      />
    );
  }

  if (phase === "stage_complete") {
    const isDeepDiveComplete = currentStage === 3;
    return (
      <StageCompletion
        stageNumber={currentStage}
        isLastStage={isDeepDiveComplete}
        onContinue={isDeepDiveComplete ? handleFinalAnalysis : handleStageCompleteContinue}
      />
    );
  }

  if (phase === "done") {
    return <CompletionScreen />;
  }

  // Main question flow
  const progress = getProgress();
  const isQuestionPhase = phase === "profile" || phase === "core" || phase === "deep_dive";

  // Get theme for current question
  let currentTheme = null;
  let dimensionLabel = "";
  let poolLabel = "";

  if (phase === "core" && currentPage?.type === "core") {
    currentTheme = getDimensionTheme(currentPage.question.dimension);
    dimensionLabel = getDimensionLabel(currentPage.question.dimension);
  } else if (phase === "deep_dive" && currentPage?.type === "deep_dive") {
    currentTheme = getPoolTheme(currentPage.question.pool);
    poolLabel = getPoolLabel(currentPage.question.pool);
  }

  return (
    <div
      className={clsx(
        "min-h-[100dvh] flex flex-col transition-colors duration-500",
        isQuestionPhase && currentTheme
          ? `bg-gradient-to-br ${currentTheme.bgGradient}`
          : "bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC]"
      )}
    >
      {/* ========== MOBILE HEADER ========== */}
      <div className="md:hidden sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-100/50 pt-safe">
        <div className="px-3 py-2">
          {/* Compact mobile header row */}
          <div className="flex items-center gap-2 mb-1.5">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={clsx(
                "p-1.5 -ml-1 rounded-lg transition-all touch-manipulation",
                currentIndex === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 active:bg-gray-100 active:scale-95"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-semibold text-[#5B7B6A] bg-[#5B7B6A]/10 px-2 py-0.5 rounded-full">
                {progress.label}
              </span>
              {(phase === "core" && dimensionLabel) && (
                <span className={clsx("text-[10px] font-medium px-1.5 py-0.5 rounded-full", currentTheme?.badge, currentTheme?.badgeText)}>
                  {dimensionLabel}
                </span>
              )}
              {(phase === "deep_dive" && poolLabel) && (
                <span className={clsx("text-[10px] font-medium px-1.5 py-0.5 rounded-full", currentTheme?.badge, currentTheme?.badgeText)}>
                  {poolLabel}
                </span>
              )}
            </div>

            <span className="text-[11px] text-gray-500 font-semibold tabular-nums min-w-[40px] text-right">
              {currentIndex + 1}/{totalPages}
            </span>
          </div>

          {/* Thin mobile progress bar */}
          <div className="h-1 bg-gray-200/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#5B7B6A] to-[#7A9A8A]"
              initial={false}
              animate={{ width: `${progress.subProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ========== DESKTOP HEADER ========== */}
      <div className="hidden md:block sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-white/50 pt-safe">
        <div className="max-w-xl mx-auto px-4 py-3">
          {/* Back button and progress */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={clsx(
                "p-2 -ml-2 rounded-xl transition-all",
                currentIndex === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 active:scale-95"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 text-center">
              <h1 className="text-sm font-bold text-gray-900 tracking-tight">
                {clientName || "Karakter Analizi"}
              </h1>
            </div>

            <div className="w-9" /> {/* Spacer for centering */}
          </div>

          {/* Question counter and stage progress */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#5B7B6A] bg-[#5B7B6A]/10 px-2.5 py-1 rounded-full">
                {progress.label}
              </span>
              {(phase === "core" && dimensionLabel) && (
                <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", currentTheme?.badge, currentTheme?.badgeText)}>
                  {dimensionLabel}
                </span>
              )}
              {(phase === "deep_dive" && poolLabel) && (
                <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", currentTheme?.badge, currentTheme?.badgeText)}>
                  {poolLabel}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium tabular-nums">
              {currentIndex + 1} / {totalPages}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#5B7B6A] to-[#7A9A8A]"
              initial={false}
              animate={{ width: `${progress.subProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Question content */}
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          {currentPage && (
            <motion.div
              key={`${phase}-${currentIndex}`}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm"
            >
              {/* Profile Questions */}
              {currentPage.type === "profile" && (
                <>
                  {currentPage.field.answer_type === "single_choice" && currentPage.field.options && (
                    <SingleChoiceQuestion
                      question={currentPage.field.text}
                      options={currentPage.field.options}
                      value={profile[currentPage.field.id] as string | boolean}
                      onAnswer={(val) => handleProfileAnswerAndNext(currentPage.field.id, val)}
                    />
                  )}

                  {currentPage.field.answer_type === "boolean" && (
                    <BooleanQuestion
                      question={currentPage.field.text}
                      value={profile[currentPage.field.id] as boolean}
                      options={currentPage.field.options as { value: boolean; label: string }[]}
                      onAnswer={(val) => handleProfileAnswerAndNext(currentPage.field.id, val)}
                    />
                  )}

                  {currentPage.field.answer_type === "multi_select" && currentPage.field.options && (
                    <MultiSelectQuestion
                      question={currentPage.field.text}
                      options={currentPage.field.options.map((o) => ({
                        value: String(o.value),
                        label: o.label,
                      }))}
                      value={(profile[currentPage.field.id] as string[]) || []}
                      onAnswer={(val) => handleProfileAnswer(currentPage.field.id, val)}
                      onNext={handleProfileNext}
                    />
                  )}

                  {currentPage.field.answer_type === "numeric" && (
                    <NumericQuestion
                      question={currentPage.field.text}
                      value={profile[currentPage.field.id] as number}
                      min={currentPage.field.numeric_range?.min}
                      max={currentPage.field.numeric_range?.max}
                      onAnswer={(val) => handleProfileAnswer(currentPage.field.id, val)}
                      onNext={handleProfileNext}
                      suffix={currentPage.field.id === "height" ? "cm" : currentPage.field.id === "weight" ? "kg" : undefined}
                    />
                  )}

                  {currentPage.field.answer_type === "text" && (
                    <TextQuestion
                      question={currentPage.field.text}
                      value={profile[currentPage.field.id] as string}
                      onAnswer={(val) => handleProfileAnswer(currentPage.field.id, val)}
                      onNext={handleProfileNext}
                    />
                  )}
                </>
              )}

              {/* Core Questions */}
              {currentPage.type === "core" && (
                <ScaleQuestion
                  question={currentPage.question.text}
                  value={coreAnswers[currentPage.question.id]}
                  labels={currentPage.question.scale_labels}
                  onAnswer={(val) => handleCoreAnswer(currentPage.question.id, val)}
                  accentColor={currentTheme?.accent}
                />
              )}

              {/* Deep Dive Questions */}
              {currentPage.type === "deep_dive" && (
                <>
                  {(currentPage.question.answer_type === "scale" || !currentPage.question.answer_type) && (
                    <ScaleQuestion
                      question={currentPage.question.text}
                      value={deepDiveAnswers[currentPage.question.id] as number | undefined}
                      labels={currentPage.question.scale_labels}
                      onAnswer={(val) => handleDeepDiveAnswer(currentPage.question.id, val)}
                      accentColor={currentTheme?.accent}
                    />
                  )}

                  {currentPage.question.answer_type === "single_choice" && currentPage.question.options && (
                    <SingleChoiceQuestion
                      question={currentPage.question.text}
                      options={currentPage.question.options}
                      value={deepDiveAnswers[currentPage.question.id]?.toString()}
                      onAnswer={(val) => handleDeepDiveAnswer(currentPage.question.id, String(val))}
                    />
                  )}

                  {currentPage.question.answer_type === "multi_select" && currentPage.question.options && (
                    <MultiSelectQuestion
                      question={currentPage.question.text}
                      options={currentPage.question.options}
                      value={(deepDiveAnswers[currentPage.question.id] as string[]) || []}
                      onAnswer={(val) => handleDeepDiveAnswer(currentPage.question.id, val)}
                      onNext={() => {
                        if (currentIndex < totalPages - 1) {
                          goNext();
                        } else {
                          setPhase("stage_complete");
                        }
                      }}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
