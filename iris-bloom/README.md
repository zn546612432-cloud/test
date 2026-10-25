# FLORA — Iris Bloom (work in progress)

A mobile-first experiment inspired by an interactive, hand-controlled iris flower.

## Saved project state

- `dist/index.html` and `dist/main.js`: an unfinished Three.js iris/MediaPipe prototype.
- `.agents/skills/build-gesture-animation/`: project-scoped copy of the MIT-licensed [senlindesign/build-gesture-animation](https://github.com/senlindesign/build-gesture-animation) skill, audited and installed from upstream commit `77d98ef` (2026-07-16).

**This is a source snapshot, not a completed or published flower animation.** The image-sequence animation, camera gesture QA, and mobile browser validation are still pending. The existing `gesture-doll-lab.html` in the repository root is independent and is not modified by this folder.

## Next steps

1. Produce and approve a fixed-camera, continuous lavender iris bloom animation video (bud → full bloom, with consistent stem and framing).
   - Ready-to-use production and negative prompts: [`prompts/lavender-iris-bloom-video.md`](prompts/lavender-iris-bloom-video.md).
   - Skill task and validation status: [`.agents/tasks/build-gesture-animation.md`](.agents/tasks/build-gesture-animation.md).
2. Use the included skill's `prepare_media.py` to select up to 60 4:3 WebP frames.
3. Use Pinch as the main gesture, validate the animation and test camera permissions on a real iPhone over HTTPS.

The original skill's MIT license is retained inside its folder. The source video is not included because a finalized video has not yet been made.
