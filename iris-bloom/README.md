# FLORA — Iris Bloom (work in progress)

A mobile-first experiment inspired by an interactive, hand-controlled iris flower.

## Saved project state

- `dist/index.html` and `dist/main.js`: an unfinished Three.js iris/MediaPipe prototype.
- `.agents/skills/build-gesture-animation/`: project-scoped copy of the MIT-licensed [senlindesign/build-gesture-animation](https://github.com/senlindesign/build-gesture-animation) skill, audited and installed from upstream commit `77d98ef` (2026-07-16).

## Lavender iris animation (first complete 60-frame draft)

The user-provided video has now been converted to a complete 60-frame 912×684 WebP sequence. The original 16:9 source was preserved and a separate 4:3 working copy was created with top/bottom background extension, so the outer petals are not cropped.

- [`gesture-sequence/preview.html`](gesture-sequence/preview.html): **manual preview** — drag directly on the flower, scrub the slider, or play the bloom forward/backward. No camera needed.
- [`gesture-sequence/index.html`](gesture-sequence/index.html): the Skill's generated MediaPipe gesture-control experiment (Pinch, `invert: false`).
- `gesture-sequence/frames/lavender-iris/1.webp` through `60.webp`: extracted WebP images (total approximately 0.69 MiB).
- [`gesture-sequence/project.config.json`](gesture-sequence/project.config.json): one artwork with a 60-frame sequence.
- [`build-standalone-preview.mjs`](build-standalone-preview.mjs): regenerate a single offline HTML with all 60 frames embedded for sharing.

**The skill validator passed**, but camera gesture QA and real iPhone-browser validation are still pending. This is not yet a publicly hosted site. The original video and the derived MP4 remain outside the tracked source files. The existing `gesture-doll-lab.html` in the repository root is independent and is not modified by this folder.

## Next steps

1. ~~Produce and approve a fixed-camera, continuous lavender iris bloom animation video (bud → full bloom, with consistent stem and framing).~~ **Done**; video received and checked, with 4:3 background extension applied to a separate copy.
   - Ready-to-use production and negative prompts: [`prompts/lavender-iris-bloom-video.md`](prompts/lavender-iris-bloom-video.md).
   - Skill task and validation status: [`.agents/tasks/build-gesture-animation.md`](.agents/tasks/build-gesture-animation.md).
2. ~~Use the included skill's `prepare_media.py` to select up to 60 4:3 WebP frames.~~ **Done**: 60 frames passed validation.
3. Preview using `gesture-sequence/preview.html`; then test Pinch and camera permissions on a real iPhone over HTTPS.

The original skill's MIT license is retained inside its folder. The source video is not included because a finalized video has not yet been made.
