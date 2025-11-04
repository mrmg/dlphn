# Deploy Watermark Feature

To deploy the updated Cloud Functions with watermarking capability:

## 1. Install Dependencies
```bash
cd functions
npm install
```

## 2. Deploy Functions
```bash
firebase deploy --only functions
```

## What This Adds

- **Watermark Function**: Automatically adds the Horrid Dolphin logo to all generated monster images
- **Positioning**: Logo appears in the bottom-left corner with 2% padding
- **Size**: Logo is sized to 15% of the image width
- **Opacity**: Logo is composited with 'over' blend mode for proper visibility
- **Fallback**: If watermarking fails, the original image is still saved

## Technical Details

- Uses Sharp library for image processing
- Fetches logo from the public assets storage bucket
- Resizes logo proportionally to fit the watermark size
- Composites logo onto the main image before saving to storage
- Maintains original image quality and format (PNG)

## Testing

After deployment, create a new monster to see the watermark in action. The logo should appear as a faded watermark in the bottom-left corner of all generated monster images.