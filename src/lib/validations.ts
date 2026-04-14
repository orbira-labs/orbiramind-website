import { z } from "zod";

const NAME_MAX_LENGTH = 50;
const CITY_MAX_LENGTH = 50;
const DISTRICT_MAX_LENGTH = 60;
const COMPANY_NAME_MAX_LENGTH = 100;
const NOTE_MAX_LENGTH = 1000;
const PASSWORD_MAX_LENGTH = 72;
const TR_PHONE_REGEX = /^0\d{3} \d{3} \d{2} \d{2}$/;
const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_INPUT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(2, `${label} en az 2 karakter olmalı`)
    .max(maxLength, `${label} en fazla ${maxLength} karakter olabilir`);

const optionalText = (maxLength: number) =>
  z
    .string()
    .optional()
    .transform((v) => v?.trim() || undefined)
    .pipe(
      z.string().max(maxLength, `En fazla ${maxLength} karakter olabilir`).optional()
    );

const emailField = z
  .string()
  .min(1, "Email adresi gerekli")
  .email("Geçerli bir email adresi girin");

const optionalEmailField = z
  .string()
  .optional()
  .transform((v) => {
    const trimmed = v?.trim().toLowerCase();
    return trimmed === "" ? undefined : trimmed;
  })
  .pipe(z.string().email("Geçerli bir email girin").optional());

const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalı")
  .max(PASSWORD_MAX_LENGTH, `Şifre en fazla ${PASSWORD_MAX_LENGTH} karakter olabilir`);

const optionalPhoneSchema = z
  .string()
  .optional()
  .transform((v) => {
    const trimmed = v?.trim();
    return trimmed === "" ? undefined : trimmed;
  })
  .pipe(
    z
      .string()
      .regex(TR_PHONE_REGEX, "Telefon numarasını 05XX XXX XX XX formatında girin")
      .optional()
  );

const optionalBirthDateSchema = z
  .string()
  .optional()
  .transform((v) => {
    const trimmed = v?.trim();
    return trimmed === "" ? undefined : trimmed;
  })
  .pipe(
    z
      .string()
      .regex(DATE_INPUT_REGEX, "Geçerli bir doğum tarihi girin")
      .refine(
        (value) => !Number.isNaN(new Date(value).getTime()),
        "Geçerli bir doğum tarihi girin"
      )
      .refine((value) => {
        const birthDate = new Date(`${value}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return birthDate <= today;
      }, "Doğum tarihi gelecekte olamaz")
      .optional()
  );

const consentSchema = (label: string) =>
  z.boolean().refine((value) => value, {
    message: `${label} kabul etmelisiniz`,
  });

export const loginSchema = z.object({
  email: emailField,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    email: emailField,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    kvkk_accepted: consentSchema("KVKK Aydınlatma Metni'ni"),
    terms_accepted: consentSchema("Kullanım Koşulları'nı"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "6 haneli kodu girin"),
});

export const onboardingSchema = z
  .object({
    first_name: requiredText("Ad", NAME_MAX_LENGTH),
    last_name: requiredText("Soyad", NAME_MAX_LENGTH),
    phone: optionalPhoneSchema,
    city: z
      .string()
      .trim()
      .min(1, "İl seçin")
      .max(CITY_MAX_LENGTH, `İl en fazla ${CITY_MAX_LENGTH} karakter olabilir`),
    district: requiredText("İlçe", DISTRICT_MAX_LENGTH),
    work_type: z.enum(["individual", "company"]),
    company_name: optionalText(COMPANY_NAME_MAX_LENGTH),
    specializations: z.array(z.string()).min(1, "En az bir uzmanlık alanı seçin"),
    kvkk_accepted: consentSchema("KVKK Aydınlatma Metni'ni"),
    terms_accepted: consentSchema("Kullanım Koşulları'nı"),
  })
  .superRefine((data, ctx) => {
    if (data.work_type === "company" && !data.company_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company_name"],
        message: "İşyeri / Klinik Adı zorunludur",
      });
    }
  });

export const clientSchema = z.object({
  first_name: requiredText("Ad", NAME_MAX_LENGTH),
  last_name: requiredText("Soyad", NAME_MAX_LENGTH),
  email: optionalEmailField,
  phone: optionalPhoneSchema,
  birth_date: optionalBirthDateSchema,
  gender: z.enum(["female", "male", "other", "prefer_not_to_say"]).optional(),
  note: optionalText(NOTE_MAX_LENGTH),
});

export const appointmentSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(DATE_INPUT_REGEX, "Geçerli bir tarih seçin")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Geçerli bir tarih seçin"
    ),
  time: z
    .string()
    .trim()
    .regex(TIME_INPUT_REGEX, "Geçerli bir saat seçin"),
  duration_minutes: z
    .number()
    .min(15, "Süre en az 15 dakika olmalı")
    .max(180, "Süre en fazla 180 dakika olabilir"),
  note: optionalText(NOTE_MAX_LENGTH),
});

export const createAppointmentSchema = appointmentSchema.extend({
  client_id: z
    .string()
    .optional()
    .transform((v) => {
      const trimmed = v?.trim();
      return trimmed === "" ? undefined : trimmed;
    })
    .pipe(z.string().uuid("Danışan seçin").optional()),
  new_first_name: optionalText(NAME_MAX_LENGTH),
  new_last_name: optionalText(NAME_MAX_LENGTH),
});

export const profileSettingsSchema = z.object({
  first_name: requiredText("Ad", NAME_MAX_LENGTH),
  last_name: requiredText("Soyad", NAME_MAX_LENGTH),
  phone: optionalPhoneSchema,
  city: requiredText("İl", CITY_MAX_LENGTH),
  district: requiredText("İlçe", DISTRICT_MAX_LENGTH),
  specializations: z.array(z.string()).min(1, "En az bir uzmanlık alanı seçin"),
});

export const sendTestNewClientSchema = z.object({
  first_name: requiredText("Ad", NAME_MAX_LENGTH),
  last_name: requiredText("Soyad", NAME_MAX_LENGTH),
  email: optionalEmailField,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
export type SendTestNewClientInput = z.infer<typeof sendTestNewClientSchema>;
