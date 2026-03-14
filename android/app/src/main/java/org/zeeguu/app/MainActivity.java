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

    private void handleShareIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String type = intent.getType();
        if (Intent.ACTION_SEND.equals(action) && "text/plain".equals(type)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null) {
                String url = extractUrl(sharedText);
                if (url != null) {
                    try {
                        String encodedUrl = java.net.URLEncoder.encode(url, "UTF-8");
                        String path = "/shared-article?url=" + encodedUrl;
                        getBridge().getWebView().post(() -> {
                            getBridge().getWebView().evaluateJavascript(
                                "window.location.href = '" + path + "';",
                                null
                            );
                        });
                    } catch (java.io.UnsupportedEncodingException e) {
                        // UTF-8 is always supported
                    }
                }
            }
        }
    }

    private String extractUrl(String text) {
        java.util.regex.Matcher matcher = Patterns.WEB_URL.matcher(text);
        if (matcher.find()) {
            String url = matcher.group();
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
            }
            return url;
        }
        return null;
    }
}
