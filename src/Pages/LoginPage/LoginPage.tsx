import * as Yup from "yup"
import { useAuth } from "../../Context/useAuth"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"

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
    <section className="bg-abyss min-h-screen font-sans">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-depth rounded-2xl shadow-xl border border-ridge/40 md:mb-20 sm:max-w-md">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-foam font-display">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-semibold text-mist"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-abyss border border-ridge/60 text-foam sm:text-sm rounded-lg focus:ring-2 focus:ring-pulse/10 focus:border-pulse block w-full p-2.5 outline-none placeholder-mist/60"
                  placeholder="Username"
                  {...register("userName")}
                />
                {errors.userName ? (
                  <p className="text-loss text-xs font-semibold mt-1">{errors.userName.message}</p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-semibold text-mist"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-abyss border border-ridge/60 text-foam sm:text-sm rounded-lg focus:ring-2 focus:ring-pulse/10 focus:border-pulse block w-full p-2.5 outline-none placeholder-mist/60"
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-loss text-xs font-semibold mt-1">{errors.password.message}</p>
                ) : (
                  ""
                )}
              </div>
              <button
                type="submit"
                className="w-full text-abyss bg-pulse hover:bg-pulse-dim focus:ring-4 focus:outline-none focus:ring-pulse/20 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
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
    </section>
  )
}

export default LoginPage
