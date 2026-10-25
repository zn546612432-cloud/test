# Build Gesture Animation Tasks — FLORA Iris Bloom

- [x] Confirm or generate the source video
  - User provided an original MP4 in the current conversation; preserved without modification.
- [x] Check Python, FFmpeg, ffprobe, and WebP support
  - Passed: Python 3.12.14, FFmpeg, ffprobe, and FFmpeg libwebp encoder.
- [x] Inspect source duration, dimensions, rotation, and decoded frame count
  - 5.053 s, 910×512 landscape (16:9), rotation 0°, 151 decoded frames. Eight sample frames show a coherent bud-to-bloom change.
- [x] Resolve 4:3 crop issue before extraction
  - User approved option A: preserve source and create a 4:3 derivative extending the top and bottom background to retain all six main petals.
  - Passed: derived `review/lavender-iris-padded-4x3.mp4` is 912×684, 5.033 s, 151 frames; visually reviewed its final frame and confirmed both lateral petals remain fully visible.
- [x] Confirm artwork, target frame count, controls, and inversion
  - One artwork (`lavender-iris`), 60 target frames, primary Pinch control with `invert: false`: close fingers = bud, separate fingers = bloom.
- [x] Extract and verify WebP frames
  - Skill prepared 60 continuous, numbered 912×684 WebP frames in `gesture-sequence/frames/lavender-iris/`, total 0.69 MiB; first and last images visually reviewed.
- [x] Write configuration and scaffold the site
  - `gesture-sequence/` generated using the Skill's `scaffold_site.py` with `--preserve-frames`; one Pinch control (`invert: false`) and 60-frame artwork. Added `preview.html` with touch drag, slider, forward/reverse playback, and pause.
- [x] Run project validation and resolve every failure
  - Skill's `validate_project.py` passed: 60 sequential 912×684 decodable WebP frames, 0.69 MiB. `node --check app.js` and standalone inline preview JavaScript syntax check passed.
- [ ] Verify desktop and mobile behavior locally
- [ ] Record final evidence and delivery details

## Active stage

Verify the preview through a local server and available browsers, then package and deliver. Camera gesture behavior still requires a real HTTPS phone test.
