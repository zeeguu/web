export const ALL = "all";
export const NOT_SHARED = "not-shared";

/** Classes a text is shared with, tolerating an API that only sends names. */
export function sharedClassesOf(article) {
  return article.shared_with || (article.cohorts || []).map((name) => ({ id: name, name }));
}

/**
 * One chip per class the teacher has actually shared something with, plus All
 * and — only when there is something in it — Not shared. Counts come from the
 * texts themselves rather than from the class list, so a chip never promises
 * texts that are not in the list below it.
 */
export function buildClassFilters(articles) {
  const counts = new Map();
  let notShared = 0;

  for (const article of articles) {
    const classes = sharedClassesOf(article);
    if (classes.length === 0) notShared += 1;
    for (const each of classes) {
      const existing = counts.get(each.id);
      counts.set(each.id, { id: each.id, name: each.name, count: (existing?.count || 0) + 1 });
    }
  }

  const classFilters = [...counts.values()].sort((a, b) => a.name.localeCompare(b.name));

  return [
    { id: ALL, name: "All", count: articles.length },
    ...classFilters,
    ...(notShared > 0 ? [{ id: NOT_SHARED, name: "Not shared", count: notShared, dashed: true }] : []),
  ];
}

export function filterTexts(articles, filterId) {
  if (filterId === ALL) return articles;
  if (filterId === NOT_SHARED) return articles.filter((a) => sharedClassesOf(a).length === 0);
  return articles.filter((a) => sharedClassesOf(a).some((each) => each.id === filterId));
}
