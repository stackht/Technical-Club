import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type FormState = {
  name: string
  email: string
  phone: string
  status: "idle" | "loading" | "success"
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  status: "idle",
}

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField(
      state,
      action: PayloadAction<{ field: "name" | "email" | "phone"; value: string }>,
    ) {
      state[action.payload.field] = action.payload.value
    },
    setStatus(state, action: PayloadAction<FormState["status"]>) {
      state.status = action.payload
    },
    resetForm(state) {
      state.name = ""
      state.email = ""
      state.phone = ""
      state.status = "idle"
    },
  },
})

export const { updateField, setStatus, resetForm } = formSlice.actions
export default formSlice.reducer
