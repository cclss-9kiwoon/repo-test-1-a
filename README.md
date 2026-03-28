# Vibe Kanban macOS App

`npx vibe-kanban` 없이 macOS 네이티브 앱으로 Vibe Kanban을 실행합니다.
브라우저 대신 독립 창(WKWebView)에서 동작하며, 앱 아이콘 더블클릭으로 바로 시작됩니다.

## 스펙

| 항목 | 내용 |
|------|------|
| 기반 기술 | Swift + WKWebView (macOS 네이티브) |
| 앱 크기 | ~1.8MB |
| vibe-kanban 버전 | 0.1.8 (바이너리: `~/.vibe-kanban/bin/` 에서 자동 탐지) |
| 최소 macOS | 12.0 (Monterey) |
| 아키텍처 | arm64 (Apple Silicon), x64 (Intel) 자동 탐지 |
| 빌드 도구 | `swiftc` (Xcode Command Line Tools) |

## 빠른 시작

### 1. 사전 준비

vibe-kanban 바이너리가 필요합니다. 한 번만 실행하면 자동 다운로드됩니다:

```bash
npx vibe-kanban@0.1.8
# 실행 후 Ctrl+C로 종료해도 됩니다. 바이너리가 ~/.vibe-kanban/bin/ 에 캐시됩니다.
```

Xcode Command Line Tools도 필요합니다:

```bash
xcode-select --install  # 이미 설치되어 있으면 생략
```

### 2. 빌드

```bash
chmod +x build.sh
./build.sh
```

결과: 같은 폴더에 `VibeKanban.app` 생성

### 3. 실행

- **Finder에서** `VibeKanban.app` 더블클릭
- **터미널에서** `open VibeKanban.app`

### 4. Dock에 고정

앱 실행 후 Dock 아이콘 우클릭 → **옵션** → **Dock에 유지**

## 주요 로직 Flow

```
앱 실행 (더블클릭)
  │
  ▼
AppDelegate.applicationDidFinishLaunching
  │
  ├─ 창 생성 (1400x900, 리사이즈 가능)
  ├─ 로딩 화면 표시 ("Vibe Kanban 시작 중...")
  │
  ▼
startVibeKanban()
  │
  ├─ findLatestBinary()
  │    └─ ~/.vibe-kanban/bin/ 에서 최신 버전 디렉토리 탐색
  │    └─ macos-arm64 → macos-x64 순으로 실행파일 탐지
  │
  ├─ 이미 실행 중인지 확인 (포트 파일 읽기 + TCP 연결 체크)
  │    ├─ YES → 기존 인스턴스에 바로 연결
  │    └─ NO  → 바이너리를 새로 실행
  │
  ├─ Process()로 바이너리 실행
  │    └─ BROWSER=none 환경변수로 브라우저 자동 열기 방지
  │
  ▼
waitForServer() (백그라운드 스레드)
  │
  ├─ 0.5초 간격으로 포트 파일 확인 + TCP 연결 시도
  ├─ 최대 30초 대기
  │
  ▼
loadWebView()
  │
  ├─ WKWebView 생성 → http://localhost:{port} 로드
  ├─ 외부 링크는 기본 브라우저에서 열기
  │
  ▼
앱 종료 시
  └─ applicationWillTerminate → vibeProcess.terminate()
     (앱이 직접 시작한 프로세스만 종료)
```

## 파일 구조

```
.
├── build.sh                    # 빌드 스크립트
├── VibeKanban/
│   ├── main.swift              # 앱 진입점 (NSApplication 초기화)
│   ├── AppDelegate.swift       # 핵심 로직 (프로세스 관리, WebView, 창 관리)
│   ├── GenerateIcon.swift      # 빌드 시 앱 아이콘 생성 (별도 컴파일)
│   └── Info.plist              # macOS 앱 번들 메타데이터
└── VibeKanban.app/             # 빌드 결과물 (git에 포함되지 않음)
```

## 업데이트 방법

vibe-kanban 새 버전이 나왔을 때:

### 1. 새 바이너리 다운로드

```bash
npx vibe-kanban@새버전    # 예: npx vibe-kanban@2.0.0
```

이렇게 하면 `~/.vibe-kanban/bin/v새버전-*/` 에 바이너리가 캐시됩니다.

### 2. 앱 재시작

앱을 종료 후 다시 실행하면 됩니다. `findLatestBinary()`가 `~/.vibe-kanban/bin/` 내에서
**가장 최신 버전을 자동으로 탐지**하므로 앱을 다시 빌드할 필요가 없습니다.

### 3. 특정 버전 고정이 필요한 경우

자동 탐지 대신 특정 버전을 쓰고 싶으면 `AppDelegate.swift`의 `findLatestBinary()`에서
버전 디렉토리명을 하드코딩할 수 있습니다:

```swift
func findLatestBinary() -> String? {
    let homeDir = FileManager.default.homeDirectoryForCurrentUser.path
    // 특정 버전 고정 예시:
    return "\(homeDir)/.vibe-kanban/bin/v0.1.8-20260210143125/macos-arm64/vibe-kanban"
}
```

변경 후 다시 빌드:

```bash
./build.sh
```

### 4. 오래된 바이너리 정리

```bash
ls ~/.vibe-kanban/bin/          # 설치된 버전 확인
rm -rf ~/.vibe-kanban/bin/v오래된버전/  # 불필요한 버전 삭제
```
