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


class MainActivity : ComponentActivity() {
    private var lastPause: Long = -1;
    private val RESTART_TIME: Long = 15 * 60 * 1000; // 2 hours
    private var inWorkout = false;

    inner class GymRatWebAppInterface {
        @JavascriptInterface
        fun setInWorkout(state: Boolean) {
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
        webView.loadUrl("https://gym-rat-tv.vercel.app/tv")
    }

//    fun initializeBackPress() {
//        onBackPressedDispatcher.addCallback(this, object: OnBackPressedCallback(inWorkout) {
//            override fun handleOnBackPressed() {
//                Log.d("RemoteControl", "Back button pressed")
//                webView.evaluateJavascript("exitWorkout();", null)
//            }
//        })
//    }

    @OptIn(ExperimentalTvMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        loadPage()
//        initializeBackPress()
    }

    // handle and forward on arrow clicks
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        var key:String = "";

        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> {
                Log.d("RemoteControl", "Left arrow pressed")
                key = "ArrowLeft";
            }

            KeyEvent.KEYCODE_DPAD_RIGHT -> {
                Log.d("RemoteControl", "Right arrow pressed")
                key = "ArrowRight";
            }

            KeyEvent.KEYCODE_DPAD_UP -> {
                Log.d("RemoteControl", "Up arrow pressed")
                key = "ArrowUp";
            }

            KeyEvent.KEYCODE_DPAD_DOWN -> {
                Log.d("RemoteControl", "Down arrow pressed")
                key = "ArrowDown";
            }

            KeyEvent.KEYCODE_ENTER, KeyEvent.KEYCODE_DPAD_CENTER -> {
                Log.d("RemoteControl", "Enter button pressed")
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

        //val webView: WebView = findViewById(R.id.webview)
        //webView.loadUrl("javascript:(function() { onPause(); })();");
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

//        webView.loadUrl("javascript:(function() { onResume(); })();");
    }
}


@Preview(showBackground = true)
@Composable
fun GymRatPreview() {
    GymRatTheme {}
}