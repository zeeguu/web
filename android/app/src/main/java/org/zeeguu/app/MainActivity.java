package org.zeeguu.app;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {

    // Where a share waits for the web app: Capacitor Preferences' own storage
    // (group "CapacitorStorage"), read by src/hooks/usePendingShare.js. Keep
    // the key and event name in step with src/texts/pendingShare.js.
    private static final String CAPACITOR_STORAGE = "CapacitorStorage";
    private static final String PENDING_SHARE_KEY = "zeeguu.pendingShare";
    private static final String SHARE_WAITING_EVENT = "zeeguu:share";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Only a fresh launch carries a new share. Recreating the activity
        // (after process death, or reopening from Recents) hands back the
        // original intent, which would open the same share again.
        boolean fromRecents =
            (getIntent().getFlags() & Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) != 0;
        if (savedInstanceState == null && !fromRecents) {
            handleShareIntent(getIntent());
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleShareIntent(intent);
    }

    // Stores what was shared for the web app to take when it is ready. The web
    // app decides whether it is an article link or a text to read.
    private void handleShareIntent(Intent intent) {
        if (intent == null) return;
        if (!Intent.ACTION_SEND.equals(intent.getAction()) || !"text/plain".equals(intent.getType())) return;

        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText == null || sharedText.trim().isEmpty()) return;

        try {
            JSONObject share = new JSONObject();
            share.put("text", sharedText);
            getSharedPreferences(CAPACITOR_STORAGE, MODE_PRIVATE)
                .edit()
                .putString(PENDING_SHARE_KEY, share.toString())
                .apply();
        } catch (JSONException e) {
            return;
        }

        // A nudge for a page that is already running. If it isn't yet, nothing
        // is lost: the web app looks for a waiting share when it starts.
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().post(() ->
                getBridge().getWebView().evaluateJavascript(
                    "window.dispatchEvent(new Event('" + SHARE_WAITING_EVENT + "'))", null));
        }
    }
}
