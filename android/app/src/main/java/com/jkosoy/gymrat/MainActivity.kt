package com.jkosoy.gymrat
import android.annotation.SuppressLint
import android.os.Bundle
import android.util.DisplayMetrics
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.tv.material3.ExperimentalTvMaterial3Api
import com.jkosoy.gymrat.ui.theme.GymRatTheme
import kotlin.math.ceil


class MainActivity : ComponentActivity() {
    private var lastPause: Long = -1;
    private val RESTART_TIME: Long = 2 * 60 * 60 * 1000; // 2 hours


    @SuppressLint("SetJavaScriptEnabled")
    fun loadPage() {
        val webView: WebView = findViewById(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.useWideViewPort = true
        webView.settings.loadWithOverviewMode = true
        webView.settings.layoutAlgorithm = WebSettings.LayoutAlgorithm.NORMAL
        webView.settings.builtInZoomControls = false
        webView.settings.displayZoomControls = false
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        webView.clearCache(true)
        webView.setInitialScale(1)
        webView.loadUrl("https://gym-rat-tv.vercel.app/tv")
    }

    @OptIn(ExperimentalTvMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        loadPage()
    }

    // handle and forward on arrow clicks

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