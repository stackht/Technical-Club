import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type FormState = {
  email: string
  phone: string
  year: string
  branch: string
  status: "idle" | "loading" | "success"
}

const initialState: FormState = {
  email: "",
  phone: "",
  year: "",
  branch: "",
  status: "idle",
}

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField(
      state,
      action: PayloadAction<{
        field: "email" | "phone" | "year" | "branch"
        value: string
      }>,
    ) {
      state[action.payload.field] = action.payload.value
    },
    setStatus(state, action: PayloadAction<FormState["status"]>) {
      state.status = action.payload
    },
    resetForm(state) {
      state.email = ""
      state.phone = ""
      state.year = ""
      state.branch = ""
      state.status = "idle"
    },
  },
})

export const { updateField, setStatus, resetForm } = formSlice.actions
export default formSlice.reducer
