param(
    [int]$Port = 8123,
    [switch]$NoOpen
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $root "index.html"

if (-not (Test-Path -LiteralPath $indexPath)) {
    Write-Error "index.html was not found in $root."
    exit 1
}

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    $python = Get-Command py -ErrorAction SilentlyContinue
}

if (-not $python) {
    Write-Error "Python was not found on PATH. Install Python or run another static file server from $root."
    exit 1
}

$url = "http://127.0.0.1:$Port/"
Write-Host "Serving preview from $root"
Write-Host "Open $url"

if (-not $NoOpen) {
    try {
        Start-Process $url | Out-Null
    }
    catch {
        Write-Host "Open the preview manually in your browser if it does not launch automatically."
    }
}

Push-Location $root
try {
    $env:HEAD_SPACE_PREVIEW_PORT = "$Port"
    @'
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


port = int(os.environ["HEAD_SPACE_PREVIEW_PORT"])
server = ThreadingHTTPServer(("127.0.0.1", port), partial(NoCacheHandler, directory=os.getcwd()))
print(f"Serving HTTP on 127.0.0.1 port {port} (http://127.0.0.1:{port}/) ...")
server.serve_forever()
'@ | & $python.Source -
}
finally {
    Pop-Location
}
