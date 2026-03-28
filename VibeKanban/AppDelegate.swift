import Cocoa
import WebKit

class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var vibeProcess: Process?
    var port: Int = 0
    var statusItem: NSStatusItem?
    var loadingLabel: NSTextField?

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.regular)

        // Create window
        let screenFrame = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1280, height: 800)
        let windowWidth: CGFloat = min(1400, screenFrame.width * 0.85)
        let windowHeight: CGFloat = min(900, screenFrame.height * 0.85)
        let windowX = screenFrame.origin.x + (screenFrame.width - windowWidth) / 2
        let windowY = screenFrame.origin.y + (screenFrame.height - windowHeight) / 2

        window = NSWindow(
            contentRect: NSRect(x: windowX, y: windowY, width: windowWidth, height: windowHeight),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Vibe Kanban"
        window.minSize = NSSize(width: 800, height: 600)
        window.isReleasedWhenClosed = false
        window.delegate = self

        // Show loading indicator
        let loadingView = NSView(frame: window.contentView!.bounds)
        loadingView.autoresizingMask = [.width, .height]
        loadingView.wantsLayer = true
        loadingView.layer?.backgroundColor = NSColor(white: 0.12, alpha: 1.0).cgColor

        let label = NSTextField(labelWithString: "Vibe Kanban 시작 중...")
        label.font = NSFont.systemFont(ofSize: 18, weight: .medium)
        label.textColor = NSColor.white
        label.alignment = .center
        label.sizeToFit()
        label.frame = NSRect(
            x: (loadingView.bounds.width - label.bounds.width) / 2,
            y: (loadingView.bounds.height - label.bounds.height) / 2,
            width: label.bounds.width,
            height: label.bounds.height
        )
        label.autoresizingMask = [.minXMargin, .maxXMargin, .minYMargin, .maxYMargin]
        loadingView.addSubview(label)
        self.loadingLabel = label

        window.contentView = loadingView
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)

        // Start vibe-kanban binary
        startVibeKanban()
    }

    func startVibeKanban() {
        // Find the latest binary
        guard let binaryPath = findLatestBinary() else {
            showError("vibe-kanban 바이너리를 찾을 수 없습니다.\n\n먼저 'npx vibe-kanban@0.1.8'을 한 번 실행해주세요.")
            return
        }

        // Check if already running
        if let existingPort = readPortFile() {
            if isPortOpen(existingPort) {
                self.port = existingPort
                loadWebView()
                return
            }
        }

        // Start the process
        let process = Process()
        process.executableURL = URL(fileURLWithPath: binaryPath)
        process.arguments = []
        process.environment = ProcessInfo.processInfo.environment

        // Suppress browser auto-open by setting environment
        var env = ProcessInfo.processInfo.environment
        env["BROWSER"] = "none"
        env["NO_OPEN"] = "1"
        process.environment = env

        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = pipe

        do {
            try process.run()
            vibeProcess = process
        } catch {
            showError("vibe-kanban 실행 실패: \(error.localizedDescription)")
            return
        }

        // Wait for server to be ready
        waitForServer()
    }

    func findLatestBinary() -> String? {
        let homeDir = FileManager.default.homeDirectoryForCurrentUser.path
        let binDir = "\(homeDir)/.vibe-kanban/bin"

        guard let versions = try? FileManager.default.contentsOfDirectory(atPath: binDir) else {
            return nil
        }

        // Sort versions to get the latest
        let sorted = versions.sorted { $0.localizedStandardCompare($1) == .orderedDescending }

        for version in sorted {
            let binaryPath = "\(binDir)/\(version)/macos-arm64/vibe-kanban"
            if FileManager.default.isExecutableFile(atPath: binaryPath) {
                return binaryPath
            }
            // Also check Intel Mac
            let intelPath = "\(binDir)/\(version)/macos-x64/vibe-kanban"
            if FileManager.default.isExecutableFile(atPath: intelPath) {
                return intelPath
            }
        }

        return nil
    }

    func readPortFile() -> Int? {
        let tmpDir = NSTemporaryDirectory()
        // Port file is at /tmp/vibe-kanban/vibe-kanban.port or similar
        let possiblePaths = [
            "/private/var/folders/_s/5ymg9wds0g951gb2klkp0pj40000gn/T/vibe-kanban/vibe-kanban.port",
            "\(tmpDir)vibe-kanban/vibe-kanban.port",
            "/tmp/vibe-kanban/vibe-kanban.port"
        ]

        for path in possiblePaths {
            if let content = try? String(contentsOfFile: path, encoding: .utf8).trimmingCharacters(in: .whitespacesAndNewlines),
               let port = Int(content) {
                return port
            }
        }
        return nil
    }

    func isPortOpen(_ port: Int) -> Bool {
        let socket = socket(AF_INET, SOCK_STREAM, 0)
        guard socket >= 0 else { return false }
        defer { close(socket) }

        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_port = in_port_t(port).bigEndian
        addr.sin_addr.s_addr = inet_addr("127.0.0.1")

        let result = withUnsafePointer(to: &addr) { ptr in
            ptr.withMemoryRebound(to: sockaddr.self, capacity: 1) { sockPtr in
                Darwin.connect(socket, sockPtr, socklen_t(MemoryLayout<sockaddr_in>.size))
            }
        }

        return result == 0
    }

    func waitForServer() {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            var attempts = 0
            let maxAttempts = 60 // 30 seconds max

            while attempts < maxAttempts {
                // Try to read port file
                if let port = self?.readPortFile(), self?.isPortOpen(port) == true {
                    self?.port = port
                    DispatchQueue.main.async {
                        self?.loadWebView()
                    }
                    return
                }

                // Check if process died
                if let process = self?.vibeProcess, !process.isRunning {
                    DispatchQueue.main.async {
                        self?.showError("vibe-kanban 프로세스가 예기치 않게 종료되었습니다.")
                    }
                    return
                }

                Thread.sleep(forTimeInterval: 0.5)
                attempts += 1

                // Update loading text
                let dots = String(repeating: ".", count: (attempts % 3) + 1)
                DispatchQueue.main.async {
                    self?.loadingLabel?.stringValue = "Vibe Kanban 시작 중\(dots)"
                }
            }

            DispatchQueue.main.async {
                self?.showError("서버 시작 시간 초과. 다시 시도해주세요.")
            }
        }
    }

    func loadWebView() {
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "developerExtrasEnabled")

        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        webView.navigationDelegate = self

        // Custom user agent to avoid any browser detection issues
        webView.customUserAgent = "VibeKanban/1.0 (macOS; WKWebView)"

        window.contentView = webView

        let url = URL(string: "http://localhost:\(port)")!
        webView.load(URLRequest(url: url))
    }

    func showError(_ message: String) {
        let alert = NSAlert()
        alert.messageText = "Vibe Kanban"
        alert.informativeText = message
        alert.alertStyle = .critical
        alert.addButton(withTitle: "확인")
        alert.runModal()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    func applicationWillTerminate(_ notification: Notification) {
        // Only terminate the process if we started it
        if let process = vibeProcess, process.isRunning {
            process.terminate()
            process.waitUntilExit()
        }
    }
}

// MARK: - NSWindowDelegate
extension AppDelegate: NSWindowDelegate {
    func windowWillClose(_ notification: Notification) {
        NSApp.terminate(nil)
    }
}

// MARK: - WKNavigationDelegate
extension AppDelegate: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Page loaded successfully
        window.title = webView.title ?? "Vibe Kanban"
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        // Retry loading after a short delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            guard let self = self else { return }
            let url = URL(string: "http://localhost:\(self.port)")!
            self.webView.load(URLRequest(url: url))
        }
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Open external links in default browser
        if let url = navigationAction.request.url,
           url.host != "localhost" && url.host != "127.0.0.1" {
            NSWorkspace.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }
}
