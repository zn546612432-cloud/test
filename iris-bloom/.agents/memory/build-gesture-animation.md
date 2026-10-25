# Build Gesture Animation Memory

## Project Facts

- Output directory: `iris-bloom/` (existing GitHub project, prototype retained in `dist/`).
- Source videos: Uploaded 5.053-second MP4 in current workspace (`upload/9B480EB3-90CA-4EDC-87C2-3AD3FD4CD57D.mp4`), 910×512, rotation 0°, 151 decoded frames. User-uploaded original is preserved.
- Artworks: One purple/lavender bearded iris (`lavender-iris`), fixed viewpoint and warm ivory backdrop.
- Controls: One-hand `pinch`; fingers closer = frame 1 (bud), farther = last frame (open flower). Use skill's calibrated delta behavior.
- Frames: Target 60 real decoded frames; accept fewer if source has fewer.

## Decisions

- 2026-10-25: Prioritize visual coherence of the flower opening before gestures. Preserve the existing Three.js draft until the new sequence passes review.
- 2026-10-25: Use the installed `senlindesign/build-gesture-animation` pipeline for MP4 inspection, extraction, site scaffolding, and validation.
- 2026-10-25: Do not invent or repeat frames when no suitable video-generation tool or approved MP4 is available.
- 2026-10-25: User selected option A. Preserve full-width petals by creating a separate 4:3 912×684 derived MP4 with 86px top/bottom background extension and 1px horizontal margins; leave original MP4 unchanged.

## Validation Snapshot

- Environment: Passed 2026-10-25 — Python 3.12.14, FFmpeg, ffprobe, libwebp all available. No agent CLI detected (not required for media processing).
- Media: Skill prepared 60 real 912×684 WebP frames from the 151-frame padded derivative, total 0.69 MiB; first and last frames visually reviewed; original unchanged.
- Configuration: Skill scaffold completed at `gesture-sequence/`; `project.config.json` uses one 60-frame `lavender-iris` artwork and Pinch with `invert: false`. `preview.html` adds touch/mouse drag and slider controls without camera permission.
- Desktop: Skill validator and JS syntax pass; visual browser testing still pending.
- Mobile: Touch-based preview implemented; real-device test still pending.

## Warnings And Open Issues

- The installed Skill processes but does not generate source video.
- Resolved original 16:9 crop loss through a distinct 4:3 padded derivative. Background extension uses vertical edge-smearing and stretches the visible stem down through the new lower margin; appearance is acceptable for first preview but not true scene outpainting.
- The new artwork needs continuity of petal count, scale, camera, stem, light, and background across the entire clip.

## Last Handoff

- 2026-10-25: User uploaded an MP4. Preflight succeeded for duration and decoded frame count but revealed loss of side petals after 4:3 crop. Await approval to create a derivative padded 4:3 source or request a tighter-framed replacement. Then extract 60 WebP frames and validate.
