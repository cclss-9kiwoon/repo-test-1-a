#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$SCRIPT_DIR/VibeKanban"
APP_NAME="VibeKanban"
APP_DIR="$SCRIPT_DIR/$APP_NAME.app"

echo "🔨 Vibe Kanban 앱 빌드 시작..."

# Clean previous build
rm -rf "$APP_DIR"

# Create .app bundle structure
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Copy Info.plist
cp "$SRC_DIR/Info.plist" "$APP_DIR/Contents/"

# Compile Swift source files
echo "📦 Swift 컴파일 중..."
swiftc \
    -o "$APP_DIR/Contents/MacOS/$APP_NAME" \
    -framework Cocoa \
    -framework WebKit \
    -target arm64-apple-macos12.0 \
    "$SRC_DIR/main.swift" \
    "$SRC_DIR/AppDelegate.swift"

# Generate app icon
echo "🎨 앱 아이콘 생성 중..."
ICONSET_DIR="$SCRIPT_DIR/AppIcon.iconset"
mkdir -p "$ICONSET_DIR"

# Compile and run icon generator
swiftc \
    -o /tmp/vk_generate_icon \
    -framework Cocoa \
    -target arm64-apple-macos12.0 \
    "$SRC_DIR/GenerateIcon.swift"

/tmp/vk_generate_icon "$ICONSET_DIR"

# Convert iconset to icns
iconutil -c icns "$ICONSET_DIR" -o "$APP_DIR/Contents/Resources/AppIcon.icns"

# Cleanup
rm -rf "$ICONSET_DIR"
rm -f /tmp/vk_generate_icon

echo ""
echo "✅ 빌드 완료!"
echo ""
echo "📍 앱 위치: $APP_DIR"
echo ""
echo "실행 방법:"
echo "  1. Finder에서 ~/Desktop/VibeKanban/VibeKanban.app 더블클릭"
echo "  2. 또는 터미널에서: open \"$APP_DIR\""
echo ""
echo "💡 Dock에 고정하려면:"
echo "  앱 실행 후 Dock 아이콘을 우클릭 → '옵션' → 'Dock에 유지'"
