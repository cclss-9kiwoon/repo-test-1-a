// Standalone icon generator - compiled and run separately by build.sh
import Cocoa

let sizes: [(String, Int)] = [
    ("icon_16x16.png", 16),
    ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32),
    ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128),
    ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256),
    ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512),
    ("icon_512x512@2x.png", 1024),
]

guard CommandLine.arguments.count > 1 else {
    print("Usage: GenerateIcon <output_dir>")
    exit(1)
}

let outputDir = CommandLine.arguments[1]

for (filename, size) in sizes {
    let s = CGFloat(size)
    let image = NSImage(size: NSSize(width: s, height: s))
    image.lockFocus()

    // Background - gradient purple
    let rect = NSRect(x: 0, y: 0, width: s, height: s)
    let cornerRadius = s * 0.22

    let path = NSBezierPath(roundedRect: rect, xRadius: cornerRadius, yRadius: cornerRadius)

    let gradient = NSGradient(
        starting: NSColor(red: 0.388, green: 0.4, blue: 0.945, alpha: 1.0),
        ending: NSColor(red: 0.545, green: 0.36, blue: 0.965, alpha: 1.0)
    )
    gradient?.draw(in: path, angle: -45)

    // Draw "VK" text
    let fontSize = s * 0.42
    let font = NSFont.systemFont(ofSize: fontSize, weight: .heavy)
    let textAttrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: NSColor.white,
    ]

    let text = "VK" as NSString
    let textSize = text.size(withAttributes: textAttrs)
    let textX = (s - textSize.width) / 2
    let textY = (s - textSize.height) / 2
    text.draw(at: NSPoint(x: textX, y: textY), withAttributes: textAttrs)

    image.unlockFocus()

    // Save as PNG
    guard let tiffData = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiffData),
          let pngData = bitmap.representation(using: .png, properties: [:]) else {
        continue
    }

    let filePath = "\(outputDir)/\(filename)"
    try? pngData.write(to: URL(fileURLWithPath: filePath))
}

print("Icons generated in \(outputDir)")
