package com.jkosoy.gymrat
import android.annotation.SuppressLint
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.Log
import android.view.KeyEvent
import android.webkit.JavascriptInterface
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.tv.material3.ExperimentalTvMaterial3Api
import com.jkosoy.gymrat.ui.theme.GymRatTheme
import kotlin.math.ceil
import android.os.Build


class MainActivity : ComponentActivity() {
    private var lastPause: Long = -1;
    private val RESTART_TIME: Long = 15 * 60 * 1000; // 2 hours
    private var inWorkout = false;

    inner class GymRatWebAppInterface {
        @JavascriptInterface
        public fun setInWorkout(state: Boolean) {
            Log.d("Gym Rat", "Workout State is $state");
            inWorkout = state;
        }
    }

    private fun getWebView():WebView {
        val webView: WebView = findViewById(R.id.webview);
        return webView;
    }

    @SuppressLint("SetJavaScriptEnabled")
    fun loadPage() {
        val webView = getWebView();
        webView.settings.javaScriptEnabled = true
        webView.settings.useWideViewPort = true
        webView.settings.loadWithOverviewMode = true
        webView.settings.layoutAlgorithm = WebSettings.LayoutAlgorithm.NORMAL
        webView.settings.builtInZoomControls = false
        webView.settings.displayZoomControls = false
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(GymRatWebAppInterface(), "Android")
        webView.clearCache(true)
        webView.setInitialScale(1)
        val url = if (isEmulator()) "http://10.0.2.2:3000" else "https://gym-rat-tv.vercel.app/"
        Log.d("Gym Rat","Loading :: $url")
        webView.loadUrl("$url/tv")
    }


    private fun isEmulator(): Boolean {
        return (Build.FINGERPRINT.startsWith("generic") ||
                Build.FINGERPRINT.startsWith("unknown") ||
                Build.MODEL.contains("google_sdk") ||
                Build.MODEL.contains("Emulator") ||
                Build.MODEL.contains("Android SDK built for x86") ||
                Build.MANUFACTURER.contains("Genymotion") ||
                Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic") ||
                "google_sdk" == Build.PRODUCT ||
                Build.HARDWARE.contains("ranchu") ||
                Build.HARDWARE.contains("goldfish") ||
                Build.HARDWARE.contains("vbox86") ||
                Build.PRODUCT.contains("sdk") ||
                Build.PRODUCT.contains("sdk_gphone") ||
                Build.PRODUCT.contains("sdk_x86") ||
                Build.PRODUCT.contains("sdk_google") ||
                Build.PRODUCT.contains("vbox86p") ||
                Build.PRODUCT.contains("emulator") ||
                Build.PRODUCT.contains("simulator"))
    }

    private fun initializeBackPress() {
        onBackPressedDispatcher.addCallback(this, object: OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                Log.d("Gym Rat", "Back button pressed")

                if(inWorkout) {
                    val webView = getWebView();
                    webView.evaluateJavascript("exitWorkout();", null)
                }
                else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    @OptIn(ExperimentalTvMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        loadPage()
        initializeBackPress()
    }

    // handle and forward on arrow clicks
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        var key:String = "";

        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> {
                Log.d("Gym Rat", "Left arrow pressed")
                key = "ArrowLeft";
            }

            KeyEvent.KEYCODE_DPAD_RIGHT -> {
                Log.d("Gym Rat", "Right arrow pressed")
                key = "ArrowRight";
            }

            KeyEvent.KEYCODE_DPAD_UP -> {
                Log.d("Gym Rat", "Up arrow pressed")
                key = "ArrowUp";
            }

            KeyEvent.KEYCODE_DPAD_DOWN -> {
                Log.d("Gym Rat", "Down arrow pressed")
                key = "ArrowDown";
            }

            KeyEvent.KEYCODE_ENTER, KeyEvent.KEYCODE_DPAD_CENTER -> {
                Log.d("Gym Rat", "Enter button pressed")
                key = "Enter";
            }
        }

        if(key !== "") {
            val webView = getWebView();
            webView.evaluateJavascript(
                "document.dispatchEvent(new KeyboardEvent('keydown', {key: $key}));",
                null
            )

            return true;
        }

        return super.onKeyDown(keyCode, event)
    }

    override fun onPause() {
        super.onPause()
        lastPause = System.currentTimeMillis()

        val webView: WebView = findViewById(R.id.webview)
        webView.evaluateJavascript("onPause();", null)
    }

    override fun onResume() {
        super.onResume()
        val now:Long = System.currentTimeMillis()
        val delta:Long = now - lastPause
        val webView: WebView = findViewById(R.id.webview)

        if (delta > RESTART_TIME) {
            webView.reload()
            return
        }

        webView.evaluateJavascript("onResume();", null)
    }
}


@Preview(showBackground = true)
@Composable
fun GymRatPreview() {
    GymRatTheme {}
}