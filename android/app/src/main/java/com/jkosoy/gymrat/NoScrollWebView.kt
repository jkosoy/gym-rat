package com.example.webviewapp.com.jkosoy.gymrat

import android.content.Context
import android.util.AttributeSet
import android.view.MotionEvent
import android.webkit.WebView

class NoScrollWebView(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : WebView(context, attrs, defStyleAttr) {
    constructor(context: Context) : this(context, null, 0)
    constructor(context: Context, attrs: AttributeSet?) : this(context, attrs, 0)

    override fun overScrollBy(
        deltaX: Int,
        deltaY: Int,
        scrollX: Int,
        scrollY: Int,
        scrollRangeX: Int,
        scrollRangeY: Int,
        maxOverScrollX: Int,
        maxOverScrollY: Int,
        isTouchEvent: Boolean
    ): Boolean {
        return false
    }


    override fun onScrollChanged(l: Int, t: Int, oldl: Int, oldt: Int) {
        // do nothing
    }

    override fun scrollTo(x: Int, y: Int) {
        // do nothing
    }

    override fun computeScroll() {
        // do nothing
    }
}
