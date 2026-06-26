import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { searchCompanies } from "./api.tsx"
import { RouterProvider } from "react-router-dom"
import { router } from "./Routes/Routes.tsx"

console.log(searchCompanies("tsla"))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
