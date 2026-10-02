// Articles the learner hid from the feed are filtered out when it renders, not
// removed from its list: pagination and the videos-only toggle rebuild the list
// from snapshots, which would bring a removed article back, and Undo only has
// to take the id out of the set again.

export const addHidden = (hiddenIds, id) => new Set(hiddenIds).add(id);

export function removeHidden(hiddenIds, id) {
  const next = new Set(hiddenIds);
  next.delete(id);
  return next;
}

// Videos share the id space with articles but can't be hidden, so a video is
// never filtered by an article's id.
export const visibleFeedItems = (items, hiddenIds) => items.filter((each) => each.video || !hiddenIds.has(each.id));
