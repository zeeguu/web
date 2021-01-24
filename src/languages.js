function language_for_id (id, language_list) {
  for (let i = 0; i < language_list.length; i++) {
    if (language_list[i].code === id) {
      return language_list[i].name
    }
  }
}

export { language_for_id }
