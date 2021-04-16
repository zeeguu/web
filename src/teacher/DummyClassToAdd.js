export function CreateDummyClassForm() {
    const form = new FormData()
    form.append('name', "DUMMYclass")
    form.append('inv_code', "DUMMYcode")
    form.append('max_students', 50)
    form.append('language_id', "es")
    return form
  }