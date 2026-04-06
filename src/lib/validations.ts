import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Geçerli bir email adresi girin"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  code: z.string().length(6, "6 haneli kodu girin"),
});

export const onboardingSchema = z.object({
  first_name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  last_name: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  phone: z.string().optional(),
  city: z.string().min(1, "İl seçin"),
  district: z.string().min(1, "İlçe seçin"),
  work_type: z.enum(["individual", "company"]),
  company_name: z.string().optional(),
  specializations: z.array(z.string()).min(1, "En az bir uzmanlık alanı seçin"),
  kvkk_accepted: z.literal(true, {
    error: "KVKK Aydınlatma Metnini kabul etmelisiniz",
  }),
});

export const clientSchema = z.object({
  first_name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  last_name: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email girin").optional().or(z.literal("")),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(["female", "male", "other", "prefer_not_to_say"]).optional(),
  note: z.string().optional(),
});

export const appointmentSchema = z.object({
  client_id: z.string().uuid("Danışan seçin"),
  starts_at: z.string().min(1, "Tarih ve saat seçin"),
  duration_minutes: z.number().min(15),
  subject: z.string().optional(),
  note: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
