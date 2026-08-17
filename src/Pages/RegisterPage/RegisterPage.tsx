import * as Yup from "yup"
import { useAuth } from "../../Context/useAuth"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import authSkyline from "../../assets/extra/auth-office.webp"
import {
  fieldClass,
  labelClass,
  errorClass,
  primaryButtonClass,
} from "../../Helpers/formStyles"

type RegisterFormsInputs = {
  email: string
  userName: string
  password: string
}

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(12, "Password must be at least 12 characters")
    .matches(
      /[A-Z]/,
      "Password must contain at least one uppercase and lowercase letter",
    )
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
})

const passwordRules = [
  "Minimum 12 characters long",
  "At least one uppercase and lowercase letter",
  "At least one digit (0-9)",
  "At least one special character (e.g., !, @, #, $, %)",
]

const RegisterPage = () => {
  const { registerUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) })

  const handleRegister = (form: RegisterFormsInputs) => {
    registerUser(form.email, form.userName, form.password)
  }

  return (
    <section className="flex min-h-screen items-stretch bg-onyx-canvas font-sans">
      {/* Full-bleed cinematic panel. The nav pill floats over it. */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block xl:w-[55%]">
        <img
          src={authSkyline}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-onyx-canvas/55" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-onyx-canvas/85 via-onyx-canvas/25 to-onyx-canvas/70"
        />

        <div className="relative z-10 flex h-full flex-col justify-end p-14">
          <span className="mb-5 font-mono text-caption font-normal uppercase tracking-label-lg text-ivory-text/75">
            Open a sandbox account
          </span>
          <h2 className="max-w-md text-heading md:text-heading-lg font-normal text-ivory-text">
            Be wrong here, so you're right out there.
          </h2>
          <p className="mt-5 max-w-sm text-body-lg font-normal text-ivory-text/85">
            Simulated capital, real fundamentals. Nothing you do touches a
            brokerage.
          </p>
        </div>
      </div>

      {/* No card — matches LoginPage. The cinematic panel is the containing
          edge; a border here would be a box inside a box. */}
      <div className="flex flex-1 items-center justify-center px-6 pb-20 pt-28 sm:px-12">
        <div className="w-full sm:max-w-[420px]">
          <div className="mb-12">
            <span className="block font-mono text-caption font-normal uppercase tracking-label-lg text-ash-text/70">
              Get started
            </span>
            <h1 className="mt-5 text-heading md:text-heading-lg font-normal text-ivory-text">
              Create your account
            </h1>
            <p className="mt-5 text-body-lg font-normal text-ash-text">
              Takes a minute. Your portfolio is private from the first tick.
            </p>
          </div>

            <form className="space-y-8" onSubmit={handleSubmit(handleRegister)}>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className={fieldClass}
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className={errorClass}>{errors.email.message}</p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className={fieldClass}
                  placeholder="Username"
                  {...register("userName")}
                />
                {errors.userName ? (
                  <p className={errorClass}>{errors.userName.message}</p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className={fieldClass}
                  {...register("password")}
                />
                <div className="mt-3 rounded-card bg-obsidian-button p-4">
                  <p className="font-mono text-caption font-normal uppercase tracking-label text-ash-text">
                    Password requirements
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-body font-normal text-ash-text">
                    {passwordRules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
                {errors.password ? (
                  <p className={errorClass}>{errors.password.message}</p>
                ) : (
                  ""
                )}
              </div>
              <button type="submit" className={primaryButtonClass}>
                Sign Up
              </button>
              <p className="border-t border-mist-border/8 pt-8 text-body font-normal text-ash-text">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="cursor-pointer text-ivory-text underline underline-offset-4"
                >
                  Login here
                </Link>
              </p>
            </form>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
