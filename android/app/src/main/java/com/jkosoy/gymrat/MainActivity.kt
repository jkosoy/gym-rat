package com.jkosoy.gymrat
import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.tv.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.tooling.preview.Preview
import androidx.tv.material3.ExperimentalTvMaterial3Api
import androidx.tv.material3.Surface
import com.jkosoy.gymrat.ui.theme.GymRatTheme
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedDispatcher

class MainActivity : ComponentActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    fun loadPage() {
        val webView: WebView = findViewById(R.id.webview)
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()
        webView.loadUrl("https://gym-rat-tv.vercel.app/")
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
        //val webView: WebView = findViewById(R.id.webview)
        //webView.loadUrl("javascript:(function() { onPause(); })();");
    }

    override fun onResume() {
        super.onResume()
        //val webView: WebView = findViewById(R.id.webview)
        //webView.loadUrl("javascript:(function() { onResume(); })();");
    }
}


@Preview(showBackground = true)
@Composable
fun GymRatPreview() {
    GymRatTheme {}
}