// Re-encodes a video's picture to H.264 at a given width and bitrate, without
// its audio track (the page plays it muted), fast-start for the web.
// usage: swift encode.swift <in> <out.mp4> <width> <bitsPerSecond>
import AVFoundation

let a = CommandLine.arguments
let src = URL(fileURLWithPath: a[1]), dst = URL(fileURLWithPath: a[2])
let width = Int(a[3])!, bitrate = Int(a[4])!
try? FileManager.default.removeItem(at: dst)

let asset = AVURLAsset(url: src)
let sem = DispatchSemaphore(value: 0)
Task {
  do {
    let track = try await asset.loadTracks(withMediaType: .video)[0]
    let natural = try await track.load(.naturalSize)
    let transform = try await track.load(.preferredTransform)
    let fps = try await track.load(.nominalFrameRate)
    let size = natural.applying(transform)
    let w = width, h = Int((abs(size.height) * CGFloat(width) / abs(size.width) / 2).rounded()) * 2

    let reader = try AVAssetReader(asset: asset)
    let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
    reader.add(out)

    let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: w, AVVideoHeightKey: h,
      AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: Int(fps.rounded()) * 2,
        AVVideoAllowFrameReorderingKey: true,
      ],
    ])
    input.transform = transform
    input.expectsMediaDataInRealTime = false
    writer.add(input)

    guard reader.startReading() else { throw reader.error ?? NSError(domain: "enc", code: 1) }
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)
    let q = DispatchQueue(label: "enc")
    input.requestMediaDataWhenReady(on: q) {
      // The closure keeps the reader alive; without it the Task's local goes away
      while input.isReadyForMoreMediaData && reader.status == .reading {
        if let buf = out.copyNextSampleBuffer() { input.append(buf) }
        else {
          input.markAsFinished()
          writer.finishWriting {
            print("done", writer.status.rawValue, writer.error?.localizedDescription ?? "", "\(w)x\(h)")
            sem.signal()
          }
          return
        }
      }
    }
  } catch { print("error", error); sem.signal() }
}
sem.wait()
