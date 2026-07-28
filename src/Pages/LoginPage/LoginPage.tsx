import * as Yup from "yup"
import { useAuth } from "../../Context/useAuth"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import authSkyline from "../../assets/generated/auth-skyline.jpg"

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

  const fieldClass =
    "bg-black/50 border border-white/10 text-foam sm:text-sm rounded-xl focus:border-pulse/70 focus:shadow-[0_0_0_4px_rgba(255,87,26,0.12)] block w-full p-3 outline-none placeholder-mist/50 transition-all"

  return (
    <section className="bg-abyss min-h-[calc(100vh-5rem)] font-sans flex items-stretch">
      {/* Key art #4: a lit column in the dark. The auth screens are the
          threshold into the terminal, so they get the most architectural
          image in the set rather than another chart. */}
      <div className="hidden lg:block relative w-1/2 xl:w-[55%] overflow-hidden border-r border-white/8">
        <img
          src={authSkyline}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/60 via-transparent to-abyss" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-abyss/50" />

        <div className="relative z-10 h-full flex flex-col justify-end p-14">
          <span className="text-[10px] font-bold text-pulse uppercase tracking-[0.16em] font-mono mb-4">
            Market intelligence terminal
          </span>
          <h2 className="text-4xl font-bold text-foam font-display tracking-[-0.02em] leading-tight max-w-md">
            The whole tape,
            <br />
            <span className="text-pulse glow-text">one signal at a time.</span>
          </h2>
          <p className="text-sm text-mist mt-4 max-w-sm leading-relaxed">
            Your portfolio, filings, and commentary — behind a single sign-in.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full sm:max-w-md">
          <div className="glass-panel-hot rounded-2xl">
            <div className="p-7 sm:p-9 space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-foam font-display">
                  Sign in to your account
                </h1>
                <p className="text-xs text-mist">
                  Pick up exactly where you left the tape.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-mist"
                  >
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
                    <p className="text-loss text-xs font-semibold mt-1.5">
                      {errors.userName.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-mist"
                  >
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
                    <p className="text-loss text-xs font-semibold mt-1.5">
                      {errors.password.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <button
                  type="submit"
                  className="glow-action w-full text-white bg-gradient-to-r from-pulse to-[#ff8a3d] font-bold uppercase tracking-[0.12em] rounded-xl text-xs px-5 py-3.5 text-center transition-all active:scale-[0.98] cursor-pointer"
                >
                  Sign In
                </button>
                <p className="text-sm font-light text-mist">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-pulse hover:underline cursor-pointer"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
