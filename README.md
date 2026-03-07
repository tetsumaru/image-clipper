<p align="center">
  <img src="workflow/icon.png" alt="Image Clipper Logo" width="200" height="200">
</p>

<h1 align="center">Image Clipper</h1>

<p align="center">
  Alfred Workflow for browsing images in a directory and copying the selected one to your clipboard.
</p>

## Features

- Browse images from a specified directory using Alfred's Script Filter
- Quick Look support for image preview
- Automatic PNG conversion for consistent clipboard behavior (HEIC, WebP, etc.)
- Supports PNG, JPG, JPEG, GIF, HEIC, TIFF, WebP, BMP formats
- Images sorted by modification date (newest first)

## Installation

1. Download the latest `.alfredworkflow` file from the [Releases](https://github.com/tetsumaru/image-clipper/releases) page
2. Double-click the downloaded file to install it in Alfred
3. Configure the `IMG_DIR` variable in the workflow settings (default: `~/imageclipper`)

## Usage

1. Open Alfred and type `img`
2. Browse or search for images in your configured directory
3. Press Enter to copy the selected image to your clipboard as PNG
4. Press Shift to Quick Look preview an image

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `IMG_DIR` | Path to the directory containing images | `~/imageclipper` |

You can change the `IMG_DIR` variable in Alfred's workflow configuration (click the `[x]` button in the workflow editor).

## Requirements

- [Alfred 5](https://www.alfredapp.com/) with Powerpack
- macOS (uses `sips` and `osascript` for image conversion and clipboard access)
- Python 3 (included with macOS)

## How It Works

1. **Script Filter** (`list_images.py`): Scans the configured directory for image files and returns them as Alfred JSON items, sorted by modification date
2. **Run Script** (`clip_image.sh`): Converts the selected image to PNG using `sips` and copies it to the clipboard using `osascript`
3. **Notification**: Displays a confirmation after copying

## License

[MIT](LICENSE)
