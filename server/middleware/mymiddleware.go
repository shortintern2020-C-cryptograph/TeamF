// @Author Futa Nakayama
package mymiddleware

import (
	"github.com/labstack/gommon/log"
	"net/http"
	"time"
)

type captureResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func NewCaptureResponseWriter(w http.ResponseWriter) *captureResponseWriter {
	return &captureResponseWriter{w, http.StatusOK}
}

func (lrw *captureResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func AccessLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		start := time.Now()

		if r.URL.Path != "/health" && r.URL.Path != "/health/" {
			// ヘルスチェックは毎秒出力されログを汚すので出力させない
			log.Infof("[ACCESS] START %v %v\n", r.Method, r.URL)
		}

		lrw := NewCaptureResponseWriter(w)
		next.ServeHTTP(lrw, r)

		if r.URL.Path != "/v1/health" && r.URL.Path != "/v1/health/" {
			elapsed := time.Since(start)

			code := lrw.statusCode
			if code >= 500 {
				log.Errorf("[ACCESS] END %v %v %v %v\n", r.Method, code, r.URL, elapsed)
			} else if code >= 400 {
				log.Warnf("[ACCESS] END %v %v %v %v\n", r.Method, code, r.URL, elapsed)
			} else {
				log.Infof("[ACCESS] END %v %v %v %v\n", r.Method, code, r.URL, elapsed)
			}
		}
	})
}
