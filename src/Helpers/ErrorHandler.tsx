import axios from "axios"
import { toast } from "react-toastify"

export const handleError = (error: unknown) => {
   if (axios.isAxiosError(error)) {
      const err = error.response
      const errors = err?.data?.errors
      if (Array.isArray(errors)) {
         for (const val of errors) {
            toast.warning(val.description)
         }
      } else if (typeof errors == "object" && errors) {
         for (const e in errors) {
            toast.warning(errors[e][0])
         }
      } else if (err?.status == 401) {
         toast.warning("Please login")
         window.location.href = "/login"
      } else if (err?.data) {
         toast.warning(err.data)
      } else if (err) {
         toast.warning(err?.data)
      }
   }
}
