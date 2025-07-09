import z from "zod";

export interface authState {
  user: {
    userName?: string;
  } | null;
  login: (data: Login) => Promise<boolean>;
  register: (data: Register) => Promise<boolean>;
  setUser: (user: authState["user"]) => void;
}

export const loginSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  passWord: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  passWord: z.string().min(6, "Password must be at least 6 characters long"),
  sec_password: z
    .string()
    .min(6, "Confirm password must be at least 6 characters long"),
});

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
