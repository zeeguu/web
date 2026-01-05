import { tokenize } from "../utils/text/preprocessing";
import { removePunctuation } from "../utils/text/preprocessing";
import isNullOrUndefinied from "../utils/misc/isNullOrUndefinied";

// Set to true to enable verbose MWE/bookmark debugging
const MWE_DEBUG = false;

/**
 * Build a map from (sent_i, token_i) -> token info for fast lookup.
 * Needed because sent_i is GLOBAL but paragraphs are nested [para][sent][token].
 */
function buildTokenMap(paragraphs) {
  const map = new Map();
  for (let p = 0; p < paragraphs.length; p++) {
    for (let s = 0; s < paragraphs[p].length; s++) {
      for (let t = 0; t < paragraphs[p][s].length; t++) {
        const token = paragraphs[p][s][t];
        const key = `${token.sent_i}_${token.token_i}`;
        map.set(key, { paragraph_i: p, sentence_i: s, token });
      }
    }
  }
  return map;
}

/**
 * Find the token for a bookmark using coordinates, with fallback search.
 * Returns { token, sentenceTokens } or null if not found.
 */
function findTokenForBookmark(bookmark, tokenMap, paragraphs) {
  const target_s_i = bookmark["context_sent"] + bookmark["t_sentence_i"];
  const target_t_i = bookmark["context_token"] + bookmark["t_token_i"];

  if (isNullOrUndefinied(target_s_i) || isNullOrUndefinied(target_t_i)) {
    MWE_DEBUG && console.log("Bookmark skip - null coords:", bookmark["origin"]);
    return null;
  }

  const key = `${target_s_i}_${target_t_i}`;
  const tokenInfo = tokenMap.get(key);

  if (!tokenInfo) {
    MWE_DEBUG && console.log("Bookmark skip - token not found:", bookmark["origin"]);
    return null;
  }

  let { paragraph_i, sentence_i, token: target_token } = tokenInfo;
  const sentenceTokens = paragraphs[paragraph_i][sentence_i];

  // For multi-word bookmarks, verify first word matches; if not, search for it
  const bookmarkWords = tokenize(bookmark["origin"]);
  if (bookmarkWords.length > 1) {
    const firstWord = removePunctuation(bookmarkWords[0]);
    const tokenWord = removePunctuation(target_token.text);
    if (firstWord !== tokenWord) {
      const foundToken = sentenceTokens.find(t => removePunctuation(t.text) === firstWord);
      if (foundToken) {
        target_token = foundToken;
      } else {
        MWE_DEBUG && console.log("Multi-word bookmark - first word not found:", bookmark["origin"]);
        return null;
      }
    }
  }

  return { token: target_token, sentenceTokens };
}

/**
 * Validate MWE bookmark words match the tokens.
 * Returns { isValid, isSeparated, partnerToken } or { isValid: false }.
 */
function validateMweBookmark(bookmark, targetToken, sentenceTokens) {
  const bookmarkWords = tokenize(bookmark["origin"]);
  const firstWord = bookmarkWords[0];
  const secondWord = bookmarkWords.length > 1 ? bookmarkWords[1] : null;
  const targetWord = removePunctuation(targetToken.text);
  const storedPartnerTokenI = bookmark["mwe_partner_token_i"];

  MWE_DEBUG && console.log("[MWE] Validating:", { origin: bookmark["origin"], firstWord, secondWord, targetWord, storedPartnerTokenI });

  // First word must match
  if (removePunctuation(firstWord).toLowerCase() !== targetWord.toLowerCase()) {
    MWE_DEBUG && console.log("[MWE] First word mismatch, skipping");
    return { isValid: false };
  }

  // Find partner token - try stored index first, then mwe_group_id fallback
  let partnerToken = null;
  let isSeparated = false;

  if (storedPartnerTokenI != null && storedPartnerTokenI !== targetToken.token_i) {
    // Strategy 1: Use stored partner index
    partnerToken = sentenceTokens.find(t => t.token_i === storedPartnerTokenI);
    if (partnerToken && secondWord) {
      const partnerWord = removePunctuation(partnerToken.text).toLowerCase();
      const expectedWord = removePunctuation(secondWord).toLowerCase();
      if (partnerWord !== expectedWord) {
        MWE_DEBUG && console.log("[MWE] Partner word mismatch:", { expected: expectedWord, found: partnerWord });
        return { isValid: false };
      }
      isSeparated = Math.abs(storedPartnerTokenI - targetToken.token_i) > 1;
    }
  } else if (targetToken.mwe_group_id) {
    // Strategy 2: Find partners via mwe_group_id (fallback for older bookmarks)
    const partners = sentenceTokens.filter(t =>
      t !== targetToken && t.mwe_group_id === targetToken.mwe_group_id
    );
    if (partners.length > 0) {
      // Check if contiguous with all partners
      const allIndices = [targetToken.token_i, ...partners.map(p => p.token_i)].sort((a, b) => a - b);
      isSeparated = !allIndices.every((idx, i) => i === 0 || idx - allIndices[i - 1] === 1);
      MWE_DEBUG && console.log("[MWE] Found partners via group_id:", { partners: partners.map(p => p.text), isSeparated });
      // Return all partners for separated MWEs
      return { isValid: true, isSeparated, partnerTokens: partners };
    }
  }

  return { isValid: true, isSeparated, partnerToken };
}

/**
 * Restore a separated MWE - style all partner words, don't fuse.
 * Used when MWE words have other words between them (e.g., "ruft ... an").
 */
function restoreSeparatedMwe(bookmark, targetToken, partnerTokens) {
  targetToken.bookmark = bookmark;
  targetToken.mergedTokens = [{ ...targetToken, bookmark: null }];
  targetToken.mweExpression = bookmark["origin"];

  // Style all partner tokens - mark them as MWE partners so they get styling
  const partners = Array.isArray(partnerTokens) ? partnerTokens : (partnerTokens ? [partnerTokens] : []);
  for (const partner of partners) {
    partner.mweExpression = bookmark["origin"];
    partner.isMwePartner = true; // Flag for isMWEWord() to detect
  }

  MWE_DEBUG && console.log("[MWE] Separated - styling all:", { target: targetToken.text, partners: partners.map(p => p.text) });
  return true;
}

/**
 * Validate that bookmark words match the tokens at the expected positions.
 * Returns false if the article was re-tokenized and tokens no longer match.
 */
function validateBookmarkTokens(bookmark, localStartIndex, sentenceTokens) {
  const bookmarkWords = tokenize(bookmark["origin"]);
  let bookmark_i = 0;
  let text_i = 0;

  while (bookmark_i < bookmarkWords.length) {
    const bookmark_word = removePunctuation(bookmarkWords[bookmark_i]);
    if (bookmark_word.length === 0) {
      bookmark_i++;
      continue;
    }

    const tokenIndex = localStartIndex + text_i + bookmark_i;
    if (tokenIndex >= sentenceTokens.length) return false;

    const text_word = removePunctuation(sentenceTokens[tokenIndex].text);
    if (text_word.length === 0 && tokenIndex + 1 < sentenceTokens.length) {
      text_i++;
      continue;
    }
    if (bookmark_word.toLowerCase() !== text_word.toLowerCase()) return false;
    bookmark_i++;
  }

  return true;
}

/**
 * Restore a contiguous (adjacent) bookmark - fuse tokens into one.
 * Works for both MWE and non-MWE multi-word bookmarks.
 */
function restoreContiguousBookmark(bookmark, targetToken, sentenceTokens) {
  // Find the LOCAL index of targetToken within sentenceTokens array
  // (token_i is GLOBAL but sentenceTokens uses local 0-based indices)
  const localStartIndex = sentenceTokens.findIndex(t => t === targetToken);
  MWE_DEBUG && console.log("[Contiguous] localStartIndex:", localStartIndex, "targetToken:", targetToken.text, "t_total_token:", bookmark["t_total_token"]);
  if (localStartIndex === -1) {
    MWE_DEBUG && console.log("[Contiguous] FAILED - token not found in sentenceTokens");
    return false;
  }

  // Validate bookmark words match tokens (guards against re-tokenized articles)
  if (!validateBookmarkTokens(bookmark, localStartIndex, sentenceTokens)) {
    MWE_DEBUG && console.log("[Contiguous] FAILED - bookmark words don't match tokens");
    return false;
  }

  // Attach bookmark and merge tokens
  targetToken.bookmark = bookmark;
  targetToken.mergedTokens = [{ ...targetToken, bookmark: null }];

  for (let i = 1; i < bookmark["t_total_token"]; i++) {
    const nextTokenIndex = localStartIndex + i;
    if (nextTokenIndex < sentenceTokens.length) {
      MWE_DEBUG && console.log("[Contiguous] Merging token at index", nextTokenIndex, ":", sentenceTokens[nextTokenIndex].text);
      targetToken.mergedTokens.push({ ...sentenceTokens[nextTokenIndex] });
      sentenceTokens[nextTokenIndex].skipRender = true;
    }
  }
  MWE_DEBUG && console.log("[Contiguous] Done - mergedTokens:", targetToken.mergedTokens.map(t => t.text));
  return true;
}

/**
 * Main entry point: Update tokens with bookmark data for restoration.
 * Handles both regular multi-word bookmarks and MWE bookmarks (separated and contiguous).
 */
export function updateTokensWithBookmarks(bookmarks, paragraphs) {
  if (!bookmarks) return;

  MWE_DEBUG && console.log("[Bookmark] Starting restoration, bookmarks:", bookmarks?.length, "paragraphs structure:", paragraphs?.length, paragraphs?.[0]?.length, paragraphs?.[0]?.[0]?.length);

  const tokenMap = buildTokenMap(paragraphs);

  for (const bookmark of bookmarks) {
    MWE_DEBUG && console.log("[Bookmark] Processing:", bookmark["origin"], "is_mwe:", bookmark["is_mwe"], "t_total_token:", bookmark["t_total_token"]);

    const result = findTokenForBookmark(bookmark, tokenMap, paragraphs);
    if (!result) {
      MWE_DEBUG && console.log("[Bookmark] Token not found for:", bookmark["origin"]);
      continue;
    }

    const { token: targetToken, sentenceTokens } = result;
    MWE_DEBUG && console.log("[Bookmark] Found token:", targetToken.text, "sentenceTokens count:", sentenceTokens.length);

    // Skip if token already has a bookmark
    if (targetToken.bookmark) {
      MWE_DEBUG && console.log("[Bookmark] Token already has bookmark, skipping");
      continue;
    }

    if (bookmark["is_mwe"]) {
      const validation = validateMweBookmark(bookmark, targetToken, sentenceTokens);
      MWE_DEBUG && console.log("[Bookmark] MWE validation:", validation);
      if (!validation.isValid) continue;

      if (validation.isSeparated) {
        // Use partnerTokens (array) if available, otherwise partnerToken (single)
        const partners = validation.partnerTokens || validation.partnerToken;
        MWE_DEBUG && console.log("[Bookmark] Restoring separated MWE with partners:", partners);
        restoreSeparatedMwe(bookmark, targetToken, partners);
        continue;
      }
    }

    const success = restoreContiguousBookmark(bookmark, targetToken, sentenceTokens);
    MWE_DEBUG && console.log("[Bookmark] Contiguous restore result:", success, "mergedTokens:", targetToken.mergedTokens?.length);
  }
}
