import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type FormState = {
  name: string
  email: string
  identifier: string
  phone: string
  year: string
  branch: string
  otp: string
  username: string
  password: string
  status: "idle" | "loading" | "success" | "error"
}

const initialState: FormState = {
  name: "",
  email: "",
  identifier: "",
  phone: "",
  year: "",
  branch: "",
  otp: "",
  username: "",
  password: "",
  status: "idle",
}

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField(
      state,
      action: PayloadAction<{
        field:
          | "name"
          | "email"
          | "identifier"
          | "phone"
          | "year"
          | "branch"
          | "otp"
          | "username"
          | "password"
        value: string
      }>,
    ) {
      state[action.payload.field] = action.payload.value
    },
    setStatus(state, action: PayloadAction<FormState["status"]>) {
      state.status = action.payload
    },
    resetForm(state) {
      state.name = ""
      state.email = ""
      state.identifier = ""
      state.phone = ""
      state.year = ""
      state.branch = ""
      state.otp = ""
      state.username = ""
      state.password = ""
      state.status = "idle"
    },
  },
})

export const { updateField, setStatus, resetForm } = formSlice.actions
export default formSlice.reducer
