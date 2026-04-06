"use client";

import { useState, useEffect, useMemo } from "react";
import {
  createSession,
  submitAnswers,
  completeSession,
  groupProfileFields,
  type SessionData,
  type DeepDiveQuestion,
  type ProfileGroup,
} from "@/lib/engine-api";
import { getDimensionTheme, getPoolTheme, getDimensionLabel, getPoolLabel } from "@/lib/dimension-colors";
import { createClient } from "@/lib/supabase/client";
import { LikertScale } from "@/components/test/LikertScale";
import { ProfileField } from "@/components/test/ProfileField";
import { MeasurementInput } from "@/components/test/MeasurementInput";
import { AnalysisLoading } from "@/components/test/AnalysisLoading";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { User, Heart, Shield, Coffee, Apple, Sparkles, Activity, Ruler } from "lucide-react";
import { celebrateCompletion } from "@/lib/confetti";
import { celebrationPop } from "@/lib/animations";

type Phase = "loading" | "profile" | "core" | "measurements" | "deep_dive" | "analyzing" | "done" | "error";

interface TestFlowProps {
  token: string;
  clientName?: string;
}

const CATEGORY_ICONS: Record<string, typeof User> = {
  demographic: User,
  lifestyle: Heart,
  health: Shield,
  habit: Coffee,
  nutrition: Apple,
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

function CompletionScreen() {
  useEffect(() => {
    celebrateCompletion();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4">
      <motion.div
        variants={celebrationPop}
        initial="initial"
        animate="animate"
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center"
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
  const [measurements, setMeasurements] = useState<Record<string, unknown>>({});
  const [deepDiveAnswers, setDeepDiveAnswers] = useState<Record<string, number>>({});

  const [profileGroupIndex, setProfileGroupIndex] = useState(0);
  const [currentCoreIndex, setCurrentCoreIndex] = useState(0);
  const [currentDeepDiveIndex, setCurrentDeepDiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const profileGroups: ProfileGroup[] = useMemo(
    () => (sessionData ? groupProfileFields(sessionData.profile_fields) : []),
    [sessionData]
  );

  useEffect(() => {
    initSession();
  }, []);

  async function initSession() {
    try {
      const data = await createSession(token);
      setSessionId(data.session_id);
      setSessionData(data);
      setPhase("profile");
    } catch (e) {
      console.error("Session init error:", e);
      setError("Bağlantı hatası oluştu. Lütfen sayfayı yenileyin.");
      setPhase("error");
    }
  }

  function handleProfileChange(fieldId: string, value: unknown) {
    setProfile((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleMeasurementChange(fieldId: string, value: unknown) {
    setMeasurements((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleCoreAnswer(questionId: string, value: number) {
    setCoreAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (sessionData && currentCoreIndex < sessionData.core_questions.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentCoreIndex((i) => i + 1);
      }, 400);
    }
  }

  function handleDeepDiveAnswer(questionId: string, value: number) {
    setDeepDiveAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (currentDeepDiveIndex < deepDiveQuestions.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentDeepDiveIndex((i) => i + 1);
      }, 400);
    }
  }

  function handleProfileGroupNext() {
    const group = profileGroups[profileGroupIndex];
    const missing = group.fields.filter((f) => f.required !== false && profile[f.id] == null);
    if (missing.length > 0) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    setError(null);
    setDirection(1);

    if (profileGroupIndex < profileGroups.length - 1) {
      setProfileGroupIndex((i) => i + 1);
    } else {
      setPhase("core");
    }
  }

  function handleProfileGroupPrev() {
    if (profileGroupIndex > 0) {
      setDirection(-1);
      setProfileGroupIndex((i) => i - 1);
      setError(null);
    }
  }

  function handleCoreToDone() {
    if (!sessionData) return;
    const answeredCount = Object.keys(coreAnswers).length;
    if (answeredCount < sessionData.core_questions.length) {
      setError(`Lütfen tüm soruları yanıtlayın (${answeredCount}/${sessionData.core_questions.length})`);
      return;
    }
    setError(null);
    setDirection(1);
    setPhase("measurements");
  }

  async function handleMeasurementsSubmit() {
    if (!sessionId || !sessionData) return;

    const requiredMeasurements = sessionData.measurement_context.filter(
      (m) => m.id === "height" || m.id === "weight"
    );
    const missingMeasurements = requiredMeasurements.filter((m) => !measurements[m.id]);
    if (missingMeasurements.length > 0) {
      setError("Lütfen boy ve kilo bilgilerinizi girin.");
      return;
    }

    setError(null);
    setPhase("loading");

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("test_invitations")
        .update({
          status: "started",
          started_at: new Date().toISOString(),
          session_id: sessionId,
        })
        .eq("token", token);

      if (updateError) {
        console.error("Test başlangıcı kaydedilemedi:", updateError);
      }

      const data = await submitAnswers(sessionId, profile, coreAnswers, measurements, token);
      setDeepDiveQuestions(data.deep_dive_questions);
      setDirection(1);
      setPhase("deep_dive");
    } catch (e) {
      console.error("Submit answers error:", e);
      setError("Cevaplar gönderilemedi. Lütfen tekrar deneyin.");
      setPhase("measurements");
    }
  }

  async function handleDeepDiveSubmit() {
    if (!sessionId) return;

    const answeredCount = Object.keys(deepDiveAnswers).length;
    if (answeredCount < deepDiveQuestions.length) {
      setError(`Lütfen tüm soruları yanıtlayın (${answeredCount}/${deepDiveQuestions.length})`);
      return;
    }

    setError(null);
    setPhase("analyzing");

    try {
      const data = await completeSession(sessionId, deepDiveAnswers, token);

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("test_invitations")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          results_snapshot: data.results,
        })
        .eq("token", token);

      if (updateError) {
        console.error("Test sonuçları kaydedilemedi:", updateError);
      }

      setPhase("done");
    } catch (e) {
      console.error("Complete session error:", e);
      setError("Analiz tamamlanamadı. Lütfen tekrar deneyin.");
      setPhase("deep_dive");
    }
  }

  // --- Progress calculation ---
  const totalProfileGroups = profileGroups.length;
  const totalPhases = totalProfileGroups + 3; // profile groups + core + measurements + deep_dive

  function getProgress(): { current: number; total: number; label: string } {
    switch (phase) {
      case "profile":
        return { current: profileGroupIndex + 1, total: totalPhases, label: "Profil" };
      case "core":
        return { current: totalProfileGroups + 1, total: totalPhases, label: "Değerlendirme" };
      case "measurements":
        return { current: totalProfileGroups + 2, total: totalPhases, label: "Ölçümler" };
      case "deep_dive":
        return { current: totalProfileGroups + 3, total: totalPhases, label: "Derinlemesine" };
      default:
        return { current: 0, total: totalPhases, label: "" };
    }
  }

  // --- Full-screen states ---

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4">
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
      <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center"
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
            className="px-8 py-3 bg-[#5B7B6A] text-white rounded-2xl font-semibold hover:bg-[#4A6A59] transition-all active:scale-[0.98] shadow-lg shadow-[#5B7B6A]/20"
          >
            Sayfayı Yenile
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === "analyzing") return <AnalysisLoading />;

  if (phase === "done") {
    return <CompletionScreen />;
  }

  // --- Main flow UI ---
  const progress = getProgress();
  const progressPercent = (progress.current / progress.total) * 100;

  const currentGroup = profileGroups[profileGroupIndex];
  const CategoryIcon = currentGroup ? (CATEGORY_ICONS[currentGroup.category] ?? Sparkles) : Sparkles;

  const currentCoreQuestion = sessionData?.core_questions[currentCoreIndex];
  const coreTheme = currentCoreQuestion ? getDimensionTheme(currentCoreQuestion.dimension) : null;

  const currentDeepDiveQuestion = deepDiveQuestions[currentDeepDiveIndex];
  const deepDiveTheme = currentDeepDiveQuestion ? getPoolTheme(currentDeepDiveQuestion.pool) : null;

  const isQuestionPhase = phase === "core" || phase === "deep_dive";
  const activeTheme = phase === "core" ? coreTheme : phase === "deep_dive" ? deepDiveTheme : null;

  return (
    <div
      className={clsx(
        "min-h-screen transition-colors duration-500",
        isQuestionPhase && activeTheme
          ? `bg-gradient-to-br ${activeTheme.bgGradient}`
          : "bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC]"
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">Karakter Analizi</h1>
              {clientName && <p className="text-xs text-gray-400 mt-0.5">{clientName}</p>}
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-[#5B7B6A] bg-[#5B7B6A]/10 px-3 py-1 rounded-full">
                {progress.label}
              </span>
            </div>
          </div>

          {/* Segmented progress bar */}
          <div className="flex gap-1">
            {Array.from({ length: progress.total }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200/60"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#5B7B6A] to-[#7A9A8A]"
                  initial={false}
                  animate={{ width: i < progress.current ? "100%" : i === progress.current ? `${getSubProgress()}%` : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-5 py-8 min-h-[calc(100vh-80px)] flex flex-col">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>

            {/* PROFILE GROUPS */}
            {phase === "profile" && currentGroup && (
              <motion.div
                key={`profile-${profileGroupIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#5B7B6A]/10 mb-4">
                    <CategoryIcon className="w-7 h-7 text-[#5B7B6A]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1.5">{currentGroup.label}</h2>
                  <p className="text-gray-500 text-sm">{currentGroup.description}</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-black/[0.04] border border-white/60 p-7 space-y-6">
                  {currentGroup.fields.map((field) => (
                    <ProfileField
                      key={field.id}
                      field={field}
                      value={profile[field.id]}
                      onChange={(value) => handleProfileChange(field.id, value)}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  {profileGroupIndex > 0 && (
                    <button
                      onClick={handleProfileGroupPrev}
                      className="px-6 py-4 rounded-2xl font-semibold text-gray-500 hover:bg-white/80 transition-all active:scale-[0.98]"
                    >
                      Geri
                    </button>
                  )}
                  <button
                    onClick={handleProfileGroupNext}
                    className="flex-1 py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/20 hover:shadow-2xl hover:shadow-[#5B7B6A]/30 transition-all active:scale-[0.98]"
                  >
                    {profileGroupIndex < profileGroups.length - 1 ? "Devam Et" : "Sorulara Geç"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* CORE QUESTIONS */}
            {phase === "core" && sessionData && currentCoreQuestion && coreTheme && (
              <motion.div
                key={`core-${currentCoreIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className={clsx("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3", coreTheme.badge, coreTheme.badgeText)}>
                    <Activity className="w-3.5 h-3.5" />
                    {getDimensionLabel(currentCoreQuestion.dimension)}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {currentCoreIndex + 1} / {sessionData.core_questions.length}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-black/[0.04] border border-white/60 p-8">
                  <p className="text-lg sm:text-xl text-gray-900 font-semibold leading-relaxed text-center mb-8">
                    {currentCoreQuestion.text}
                  </p>
                  <LikertScale
                    value={coreAnswers[currentCoreQuestion.id]}
                    onChange={(v) => handleCoreAnswer(currentCoreQuestion.id, v)}
                    labels={currentCoreQuestion.scale_labels}
                    accentColor={coreTheme.accent}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setDirection(-1); setCurrentCoreIndex((i) => Math.max(0, i - 1)); }}
                    disabled={currentCoreIndex === 0}
                    className={clsx(
                      "px-5 py-3 rounded-2xl text-sm font-semibold transition-all",
                      currentCoreIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-white/80 active:scale-[0.98]"
                    )}
                  >
                    Önceki
                  </button>
                  <div className="flex-1" />
                  {currentCoreIndex < sessionData.core_questions.length - 1 ? (
                    <button
                      onClick={() => { setDirection(1); setCurrentCoreIndex((i) => i + 1); }}
                      disabled={!coreAnswers[currentCoreQuestion.id]}
                      className={clsx(
                        "px-5 py-3 rounded-2xl text-sm font-semibold transition-all",
                        !coreAnswers[currentCoreQuestion.id] ? "text-gray-300 cursor-not-allowed" : "text-[#5B7B6A] hover:bg-[#5B7B6A]/10 active:scale-[0.98]"
                      )}
                    >
                      Sonraki
                    </button>
                  ) : (
                    <button
                      onClick={handleCoreToDone}
                      disabled={!coreAnswers[currentCoreQuestion.id]}
                      className={clsx(
                        "px-6 py-3 rounded-2xl font-semibold text-sm transition-all",
                        coreAnswers[currentCoreQuestion.id]
                          ? "bg-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/20 active:scale-[0.98]"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      Devam Et
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* MEASUREMENTS */}
            {phase === "measurements" && sessionData && (
              <motion.div
                key="measurements"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#5B7B6A]/10 mb-4">
                    <Ruler className="w-7 h-7 text-[#5B7B6A]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1.5">Ölçümler</h2>
                  <p className="text-gray-500 text-sm">Fiziksel verileriniz analizi tamamlamak için gerekli.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-black/[0.04] border border-white/60 p-7 space-y-6">
                  {sessionData.measurement_context.map((field) => (
                    <MeasurementInput
                      key={field.id}
                      field={field}
                      value={measurements[field.id]}
                      onChange={(value) => handleMeasurementChange(field.id, value)}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setDirection(-1); setPhase("core"); }}
                    className="px-6 py-4 rounded-2xl font-semibold text-gray-500 hover:bg-white/80 transition-all active:scale-[0.98]"
                  >
                    Geri
                  </button>
                  <button
                    onClick={handleMeasurementsSubmit}
                    className="flex-1 py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/20 hover:shadow-2xl hover:shadow-[#5B7B6A]/30 transition-all active:scale-[0.98]"
                  >
                    Devam Et
                  </button>
                </div>
              </motion.div>
            )}

            {/* DEEP DIVE QUESTIONS */}
            {phase === "deep_dive" && currentDeepDiveQuestion && deepDiveTheme && (
              <motion.div
                key={`deep-${currentDeepDiveIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#5B7B6A]/10 to-[#7A9A8A]/10 text-[#5B7B6A] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    Neredeyse bitti!
                  </div>
                  <div className={clsx("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2", deepDiveTheme.badge, deepDiveTheme.badgeText)}>
                    {getPoolLabel(currentDeepDiveQuestion.pool)}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {currentDeepDiveIndex + 1} / {deepDiveQuestions.length}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-black/[0.04] border border-white/60 p-8">
                  <p className="text-lg sm:text-xl text-gray-900 font-semibold leading-relaxed text-center mb-8">
                    {currentDeepDiveQuestion.text}
                  </p>
                  <LikertScale
                    value={deepDiveAnswers[currentDeepDiveQuestion.id]}
                    onChange={(v) => handleDeepDiveAnswer(currentDeepDiveQuestion.id, v)}
                    labels={currentDeepDiveQuestion.scale_labels}
                    accentColor={deepDiveTheme.accent}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setDirection(-1); setCurrentDeepDiveIndex((i) => Math.max(0, i - 1)); }}
                    disabled={currentDeepDiveIndex === 0}
                    className={clsx(
                      "px-5 py-3 rounded-2xl text-sm font-semibold transition-all",
                      currentDeepDiveIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-white/80 active:scale-[0.98]"
                    )}
                  >
                    Önceki
                  </button>
                  <div className="flex-1" />
                  {currentDeepDiveIndex < deepDiveQuestions.length - 1 ? (
                    <button
                      onClick={() => { setDirection(1); setCurrentDeepDiveIndex((i) => i + 1); }}
                      disabled={!deepDiveAnswers[currentDeepDiveQuestion.id]}
                      className={clsx(
                        "px-5 py-3 rounded-2xl text-sm font-semibold transition-all",
                        !deepDiveAnswers[currentDeepDiveQuestion.id] ? "text-gray-300 cursor-not-allowed" : "text-[#5B7B6A] hover:bg-[#5B7B6A]/10 active:scale-[0.98]"
                      )}
                    >
                      Sonraki
                    </button>
                  ) : (
                    <button
                      onClick={handleDeepDiveSubmit}
                      disabled={!deepDiveAnswers[currentDeepDiveQuestion.id]}
                      className={clsx(
                        "px-6 py-3 rounded-2xl font-semibold text-sm transition-all",
                        deepDiveAnswers[currentDeepDiveQuestion.id]
                          ? "bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white shadow-lg shadow-[#5B7B6A]/20 active:scale-[0.98]"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      Testi Tamamla
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  function getSubProgress(): number {
    switch (phase) {
      case "profile":
        return 0;
      case "core":
        return sessionData ? (Object.keys(coreAnswers).length / sessionData.core_questions.length) * 100 : 0;
      case "measurements":
        return sessionData ? (Object.keys(measurements).length / sessionData.measurement_context.length) * 100 : 0;
      case "deep_dive":
        return deepDiveQuestions.length > 0 ? (Object.keys(deepDiveAnswers).length / deepDiveQuestions.length) * 100 : 0;
      default:
        return 0;
    }
  }
}
