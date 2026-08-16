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

type LoginFormsInputs = {
  userName: string
  password: string
}

const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
})

const LoginPage = () => {
  const { loginUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) })

  const handleLogin = (form: LoginFormsInputs) => {
    loginUser(form.userName, form.password)
  }

  return (
    <section className="flex min-h-screen items-stretch bg-paper-white font-sans">
      {/* Full-bleed cinematic panel. The nav pill floats over it. */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block xl:w-[55%]">
        <img
          src={authSkyline}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-carbon-black/55" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-carbon-black/85 via-carbon-black/25 to-carbon-black/70"
        />

        <div className="relative z-10 flex h-full flex-col justify-end p-14">
          <span className="mb-5 font-mono text-caption font-normal uppercase tracking-label-lg text-paper-white/75">
            Market intelligence terminal
          </span>
          <h2 className="max-w-md text-heading md:text-heading-lg font-normal text-paper-white">
            The whole tape, one signal at a time.
          </h2>
          <p className="mt-5 max-w-sm text-body-lg font-normal text-paper-white/85">
            Your portfolio, filings, and commentary — behind a single sign-in.
          </p>
        </div>
      </div>

      {/* No card. The form sits directly on the canvas — the panel beside it
          already provides the containing edge, so a border here would be a
          box inside a box. */}
      <div className="flex flex-1 items-center justify-center px-6 pb-20 pt-28 sm:px-12">
        <div className="w-full sm:max-w-[420px]">
          <div className="mb-12">
            <span className="block font-mono text-caption font-normal uppercase tracking-label-lg text-ash-gray">
              Welcome back
            </span>
            <h1 className="mt-5 text-heading md:text-heading-lg font-normal text-carbon-black">
              Sign in to your account
            </h1>
            <p className="mt-5 text-body-lg font-normal text-zinc-gray">
              Pick up exactly where you left the tape.
            </p>
          </div>

            <form className="space-y-8" onSubmit={handleSubmit(handleLogin)}>
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
                {errors.password ? (
                  <p className={errorClass}>{errors.password.message}</p>
                ) : (
                  ""
                )}
              </div>
              <button type="submit" className={primaryButtonClass}>
                Sign In
              </button>
              <p className="border-t border-mist-gray pt-8 text-body font-normal text-zinc-gray">
                Don’t have an account yet?{" "}
                <Link
                  to="/register"
                  className="cursor-pointer text-carbon-black underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </form>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
