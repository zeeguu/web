package org.zeeguu.app;

import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleShareIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleShareIntent(intent);
    }

    // A shared link (maybe with a title) opens as an article; any other text,
    // e.g. a WhatsApp message, opens in the text reader. Same rule as
    // classifySharedText in src/reader/sharedText.js.
    private static final int MAX_WORDS_AROUND_ARTICLE_LINK = 12;

    private void handleShareIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String type = intent.getType();
        if (!Intent.ACTION_SEND.equals(action) || !"text/plain".equals(type)) return;

        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText == null || sharedText.trim().isEmpty()) return;

        String url = extractUrl(sharedText);
        if (url != null && wordsBesides(url, sharedText) <= MAX_WORDS_AROUND_ARTICLE_LINK) {
            openSharedArticle(url);
        } else {
            openSharedMessage(sharedText.trim());
        }
    }

    private void openSharedArticle(String url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        try {
            String encodedUrl = java.net.URLEncoder.encode(url, "UTF-8");
            String path = "/shared-article?url=" + encodedUrl;
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "window.reactNavigateFromNative('" + path + "')",
                    null
                );
            });
        } catch (java.io.UnsupportedEncodingException e) {
            // UTF-8 is always supported
        }
    }

    // The text goes to the page as a JS string, not in a URL, so it stays out
    // of the history. On a cold start the page may not have loaded yet, so
    // retry until window.reactReceiveSharedText exists.
    private void openSharedMessage(String text) {
        String js = "(function(t){"
            + "if (typeof window.reactReceiveSharedText !== 'function') return false;"
            + "window.reactReceiveSharedText(t); return true;"
            + "})(" + org.json.JSONObject.quote(text) + ")";
        deliverSharedMessage(js, 0);
    }

    private void deliverSharedMessage(String js, int attempt) {
        if (attempt >= 30) return;
        getBridge().getWebView().postDelayed(() ->
            getBridge().getWebView().evaluateJavascript(js, result -> {
                if (!"true".equals(result)) deliverSharedMessage(js, attempt + 1);
            }),
            attempt == 0 ? 0 : 500
        );
    }

    private int wordsBesides(String url, String text) {
        String rest = text.replace(url, " ").trim();
        if (rest.isEmpty()) return 0;
        return rest.split("\\s+").length;
    }

    private String extractUrl(String text) {
        java.util.regex.Matcher matcher = Patterns.WEB_URL.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }
}
