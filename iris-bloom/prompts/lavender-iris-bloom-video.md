# FLORA — Lavender Iris Bloom Source Video

**Goal:** One coherent continuous blooming clip suitable for reversible, hand-scrubbed frame animation. This is the **video source prompt**, not a still-image prompt.

## Positive prompt (English)

> A single continuous 5-second, locked-off macro botanical studio shot of one anatomically accurate lavender-purple bearded iris flower blooming from a tightly wrapped pointed bud to a fully opened bloom. Only one flower, one slender natural green stem, and a few restrained leaves are present. The entire plant remains centered and fully visible within a 4:3 safe composition throughout the shot. Three upright inner petals (standards) and three outer falls gradually unfurl from the same bud: the folded purple petals first separate at the tip, the inner petals rise and curve gently outward, while the outer falls unfold and drape downward under natural petal stiffness and gravity. Fine lavender-to-violet translucent veining and small warm yellow beard details emerge gradually without changing pattern or petal count. Every intermediate stage is botanically coherent and remains clearly readable when played in reverse. The first 0.3 seconds show a still closed bud and the last 0.3 seconds show the still, fully open iris. The stem stays rooted, still and fixed in exactly the same location; no wind or bobbing. Warm soft ivory background, subtle natural studio lighting from the upper left, delicate shadows, realistic petal translucency, high-resolution botanical macro photography, natural colors, sharp individual frames, restrained motion blur, elegant fine-art realism. Camera, scale, framing, focal length, focus, object orientation, lighting and background are perfectly constant. No camera movement, no cuts, no transitions, no zoom. Silent video. 4:3 aspect ratio preferred, 5 seconds, 24 or 30 fps.

## Negative prompt (English)

> extra petals, changing petal count, petals growing from nowhere, duplicate flowers, new buds, shape-morphing mistakes, plastic surfaces, melted or fused petals, stem growing or drifting, rotating flower, changing anatomy, discontinuous petal patterns, flickering veins, inconsistent center, color changes, wind, vibration, plant swaying, moving leaves, background changes, lighting changes, camera movement, camera shake, zoom, pan, tilt, focal-length changes, refocusing, reframing, cuts, edits, transitions, jump cuts, disappearing subject, teleportation, morphing into another flower, excessive motion blur, cropping, subject outside the centered 4:3 safe area, missing intermediate states, hands, person, insects, props, text, subtitles, captions, watermarks, logos, branding, music, speech.

## Visual acceptance gate

1. Start = recognizable closed lavender iris bud; end = fully open lavender iris with the same stem and center.
2. Fixed 4:3 safe area; no crop, camera motion, or scale change.
3. Petal count/identity, position of stem, yellow beard, veins, lighting, and background remain consistent.
4. Every stage looks physically plausible and the footage remains natural when scrubbed backward.
5. No cuts, logos, text, hands, duplicate flowers, or excessive blur.

## After approval

Save the approved MP4 as an input outside the site's public `dist/`, then run the installed skill's `prepare_media.py` targeting 60 WebP frames. Never manufacture duplicate frames or claim a validated animation before inspecting the video and extracted media.
