"use client";

import { motion } from "framer-motion";
import type { ProfileSummary } from "@/lib/types";

interface ProfileCardProps {
  summary: ProfileSummary;
}

const GENDER_LABELS: Record<string, string> = {
  female: "Kadın",
  male: "Erkek",
  prefer_not_to_say: "Belirtilmedi",
};

const AGE_LABELS: Record<string, string> = {
  "13_18": "13-18",
  "18_26": "18-26",
  "26_40": "26-40",
  "40_55": "40-55",
  "55_plus": "55+",
};

const BMI_LABELS: Record<string, string> = {
  underweight: "Düşük kilolu",
  normal: "Normal",
  overweight: "Hafif kilolu",
  obese: "Yüksek kilolu",
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  single: "Bekar",
  dating: "Flört",
  in_relationship: "İlişkisi var",
  engaged: "Nişanlı",
  married: "Evli",
  divorced: "Boşanmış",
  widowed: "Dul",
};

const LIVING_LABELS: Record<string, string> = {
  alone: "Yalnız yaşıyor",
  with_family: "Ailesiyle",
  with_partner: "Partneriyle",
  with_children: "Çocuklarıyla",
  with_roommate: "Ev arkadaşıyla",
  other: "Diğer",
};

const WORK_LABELS: Record<string, string> = {
  student: "Öğrenci",
  working: "Çalışan",
  working_and_studying: "Çalışan + Öğrenci",
  home_focused: "Ev odaklı",
  job_seeking: "İş arıyor",
  retired: "Emekli",
};

interface TagProps {
  label: string;
  variant?: "default" | "accent" | "warning" | "info";
}

function Tag({ label, variant = "default" }: TagProps) {
  const styles = {
    default: "bg-gray-100 text-gray-700",
    accent: "bg-[#5B7B6A]/10 text-[#5B7B6A]",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-blue-50 text-blue-700",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}

function SectionRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3">
      <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-50 flex items-center justify-center mt-0.5">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {children}
      </div>
    </div>
  );
}

const ICON_USER = "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z";
const ICON_BRAIN = "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z";
const ICON_HEART = "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z";
const ICON_HOME = "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25";

export function ProfileCard({ summary }: ProfileCardProps) {
  const s = summary;

  const demographicTags: TagProps[] = [];
  if (s.age_range) demographicTags.push({ label: AGE_LABELS[s.age_range] ?? s.age_range });
  if (s.gender) demographicTags.push({ label: GENDER_LABELS[s.gender] ?? s.gender });
  if (s.bmi_raw && s.bmi_category) {
    const variant = s.bmi_category === "normal" ? "accent" : "warning";
    demographicTags.push({ label: `BMI ${s.bmi_raw} ${BMI_LABELS[s.bmi_category] ?? s.bmi_category}`, variant });
  }
  if (s.has_chronic_condition) {
    demographicTags.push({ label: "Kronik hastalık", variant: "warning" });
  }

  const cognitiveTags: TagProps[] = [];
  if (s.thinking_style) cognitiveTags.push({ label: s.thinking_style, variant: "info" });
  if (s.decision_style) cognitiveTags.push({ label: `${s.decision_style} karar`, variant: "info" });
  if (s.social_style) cognitiveTags.push({ label: s.social_style });
  if (s.chronotype) cognitiveTags.push({ label: s.chronotype });
  if (s.routine_style) cognitiveTags.push({ label: s.routine_style });

  const behavioralTags: TagProps[] = [];
  if (s.stress_response) behavioralTags.push({ label: `Stres: ${s.stress_response}` });
  if (s.emotional_expression) behavioralTags.push({ label: s.emotional_expression });
  if (s.primary_motivation) behavioralTags.push({ label: s.primary_motivation, variant: "accent" });
  if (s.life_phase) behavioralTags.push({ label: s.life_phase });
  if (s.social_role) behavioralTags.push({ label: `Sosyal: ${s.social_role}` });

  const lifeTags: TagProps[] = [];
  if (s.relationship_status) lifeTags.push({ label: RELATIONSHIP_LABELS[s.relationship_status] ?? s.relationship_status });
  if (s.living_situation) lifeTags.push({ label: LIVING_LABELS[s.living_situation] ?? s.living_situation });
  if (s.work_status) lifeTags.push({ label: WORK_LABELS[s.work_status] ?? s.work_status });
  if (s.children_status && s.children_status !== "no_children") {
    lifeTags.push({ label: s.children_status === "1_child" ? "1 çocuk" : "2+ çocuk" });
  }

  const sections = [
    { icon: ICON_USER, tags: demographicTags },
    { icon: ICON_BRAIN, tags: cognitiveTags },
    { icon: ICON_HEART, tags: behavioralTags },
    { icon: ICON_HOME, tags: lifeTags },
  ].filter((s) => s.tags.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="p-3 sm:p-5 -m-3 sm:-m-5"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Danışan Kimlik Kartı</h3>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {sections.map((section, idx) => (
          <SectionRow key={idx} icon={section.icon}>
            {section.tags.map((tag, tidx) => (
              <Tag key={tidx} label={tag.label} variant={tag.variant} />
            ))}
          </SectionRow>
        ))}
      </div>
    </motion.div>
  );
}
