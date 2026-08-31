export const ALL = "all";
export const NOT_SHARED = "not-shared";

/**
 * Which classes a text belongs to, as {id, name}. The teacher's list carries
 * `shared_with` (the classes they gave it to); a student's classroom carries
 * `from_classes` (the classes it reached them through). Same shape, two names,
 * because they answer different questions about the same relationship.
 */
export function classesOf(article) {
  return article.shared_with || article.from_classes || [];
}

/**
 * One chip per class the teacher has actually shared something with, plus All
 * and — only when there is something in it — Not shared. Counts come from the
 * texts themselves rather than from the class list, so a chip never promises
 * texts that are not in the list below it.
 */
export function buildClassFilters(articles, { allLabel = "All" } = {}) {
  const counts = new Map();
  let notShared = 0;

  for (const article of articles) {
    const classes = classesOf(article);
    if (classes.length === 0) notShared += 1;
    for (const each of classes) {
      const existing = counts.get(each.id);
      counts.set(each.id, { id: each.id, name: each.name, count: (existing?.count || 0) + 1 });
    }
  }

  const classFilters = [...counts.values()].sort((a, b) => a.name.localeCompare(b.name));

  return [
    { id: ALL, name: allLabel, count: articles.length },
    ...classFilters,
    ...(notShared > 0 ? [{ id: NOT_SHARED, name: "Not shared", count: notShared, dashed: true }] : []),
  ];
}

export function filterTexts(articles, filterId) {
  if (filterId === ALL) return articles;
  if (filterId === NOT_SHARED) return articles.filter((a) => classesOf(a).length === 0);
  return articles.filter((a) => classesOf(a).some((each) => each.id === filterId));
}
