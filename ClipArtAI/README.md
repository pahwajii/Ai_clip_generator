# ClipArtAI

ClipArtAI is an Android-focused Expo app that turns a single uploaded photo into AI-generated clipart in five styles: Cartoon, Anime, Sketch, Pixel Art, and Flat Art.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npm run android
```

3. Make sure the backend is reachable at `https://ai-clip-generator-two.vercel.app/api/generate`.

4. On first launch, allow camera and media permissions so the app can pick photos, capture photos, and save generated images.

## Tech Decisions

- Expo Router handles a simple two-screen flow between upload and generation results.
- `expo-image-picker` and `expo-image-manipulator` keep source images square and small enough for mobile upload.
- `useGeneration` runs all five style requests in parallel and exposes typed loading, result, and error state.
- UI is split into reusable `ImagePreview`, `SkeletonLoader`, and `StyleCard` components to keep screens lean.
- Saving uses `expo-file-system` plus `expo-media-library`, and sharing uses React Native's built-in `Share` API.

## Tradeoffs

- The app retries the whole set with `Regenerate All` instead of retrying individual cards. That keeps the backend contract simple but is less efficient.
- Images are resized to `512x512` before upload to reduce latency and payload size, which can soften fine detail.
- The backend returns base64 image data directly. That simplifies rendering in Expo, but the payload is larger than serving CDN URLs.
- The UI is intentionally dark-only and Android-first to keep the first release focused.

## APK

APK download link: `[Add APK link here]`

## Demo

Screen recording link: `[Add screen recording link here]`
