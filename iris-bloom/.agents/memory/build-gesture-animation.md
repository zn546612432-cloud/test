# Build Gesture Animation Memory

## Project Facts

- Output directory: `iris-bloom/` (existing GitHub project, prototype retained in `dist/`).
- Source videos: No approved MP4 yet.
- Artworks: One purple/lavender bearded iris (`lavender-iris`), fixed viewpoint and warm ivory backdrop.
- Controls: One-hand `pinch`; fingers closer = frame 1 (bud), farther = last frame (open flower). Use skill's calibrated delta behavior.
- Frames: Target 60 real decoded frames; accept fewer if source has fewer.

## Decisions

- 2026-10-25: Prioritize visual coherence of the flower opening before gestures. Preserve the existing Three.js draft until the new sequence passes review.
- 2026-10-25: Use the installed `senlindesign/build-gesture-animation` pipeline for MP4 inspection, extraction, site scaffolding, and validation.
- 2026-10-25: Do not invent or repeat frames when no suitable video-generation tool or approved MP4 is available.

## Validation Snapshot

- Environment: Passed 2026-10-25 — Python 3.12.14, FFmpeg, ffprobe, libwebp all available. No agent CLI detected (not required for media processing).
- Media: Blocked awaiting original video.
- Configuration: Target parameters chosen, site config not generated.
- Desktop: Not tested for frame-sequence version.
- Mobile: Not tested for frame-sequence version.

## Warnings And Open Issues

- The installed Skill processes but does not generate source video.
- No approved video, so frame extraction and animation verification cannot honestly be marked complete.
- The new artwork needs continuity of petal count, scale, camera, stem, light, and background across the entire clip.

## Last Handoff

- 2026-10-25: Use `prompts/lavender-iris-bloom-video.md` to create a single suitable MP4, then use the skill's inspect/extract/validate commands.
