# Build Gesture Animation Tasks — FLORA Iris Bloom

- [ ] Confirm or generate the source video
  - **Blocked:** Need an original 4–6 second MP4 of one lavender iris blooming with a locked camera. The skill does not generate video, and the current agent has no video-generation tool.
- [x] Check Python, FFmpeg, ffprobe, and WebP support
  - Passed: Python 3.12.14, FFmpeg, ffprobe, and FFmpeg libwebp encoder.
- [ ] Inspect source duration, dimensions, rotation, and decoded frame count
- [x] Confirm artwork, target frame count, controls, and inversion
  - One artwork (`lavender-iris`), 60 target frames, primary Pinch control with `invert: false`: close fingers = bud, separate fingers = bloom.
- [ ] Extract and verify WebP frames
- [ ] Write configuration and scaffold the site
- [ ] Run project validation and resolve every failure
- [ ] Verify desktop and mobile behavior locally
- [ ] Record final evidence and delivery details

## Active stage

Source video acquisition. The next action is to generate or upload an MP4 following `prompts/lavender-iris-bloom-video.md`, then inspect it before extracting frames.
