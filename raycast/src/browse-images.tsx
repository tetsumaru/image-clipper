import {
  Grid,
  ActionPanel,
  Action,
  getPreferenceValues,
  showHUD,
  Clipboard,
  Icon,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { readdirSync, statSync, existsSync } from "fs";
import { join, extname } from "path";
import { homedir } from "os";
import { execSync } from "child_process";
import { tmpdir } from "os";

const SUPPORTED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".heic",
  ".tif",
  ".tiff",
  ".webp",
  ".bmp",
]);

interface ImageFile {
  name: string;
  path: string;
  mtime: number;
}

function resolveDirectory(dir: string): string {
  if (dir.startsWith("~/") || dir === "~") {
    return join(homedir(), dir.slice(1));
  }
  return dir;
}

function listImages(directory: string): ImageFile[] {
  const resolvedDir = resolveDirectory(directory);

  if (!existsSync(resolvedDir)) {
    return [];
  }

  const entries = readdirSync(resolvedDir);
  const images: ImageFile[] = [];

  for (const entry of entries) {
    if (entry.startsWith(".")) continue;

    const ext = extname(entry).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    const fullPath = join(resolvedDir, entry);
    try {
      const stat = statSync(fullPath);
      if (stat.isFile()) {
        images.push({ name: entry, path: fullPath, mtime: stat.mtimeMs });
      }
    } catch {
      continue;
    }
  }

  images.sort((a, b) => b.mtime - a.mtime);
  return images.slice(0, 200);
}

async function copyImageAsClipboard(imagePath: string, imageName: string) {
  const ext = extname(imagePath).toLowerCase();
  const needsConversion = ext !== ".png";

  if (needsConversion) {
    const tmpPath = join(tmpdir(), `raycast_imgclip_${Date.now()}.png`);
    try {
      execSync(
        `/usr/bin/sips -s format png "${imagePath}" --out "${tmpPath}"`,
        {
          stdio: "ignore",
        },
      );
      await Clipboard.copy({ file: tmpPath });
      execSync(`rm -f "${tmpPath}"`);
    } catch {
      await Clipboard.copy({ file: imagePath });
    }
  } else {
    await Clipboard.copy({ file: imagePath });
  }

  await showHUD(`Copied "${imageName}" to clipboard`);
}

export default function BrowseImages() {
  const { imageDirectory } = getPreferenceValues<Preferences>();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const resolvedDir = resolveDirectory(imageDirectory);
  const dirExists = existsSync(resolvedDir);

  useEffect(() => {
    const result = listImages(imageDirectory);
    setImages(result);
    setIsLoading(false);
  }, [imageDirectory]);

  if (!dirExists) {
    return (
      <Grid>
        <Grid.EmptyView
          icon={Icon.Folder}
          title="Directory Not Found"
          description={`The directory "${imageDirectory}" does not exist. Please configure the Image Directory in extension preferences.`}
        />
      </Grid>
    );
  }

  return (
    <Grid
      columns={5}
      isLoading={isLoading}
      searchBarPlaceholder="Search images..."
    >
      {images.length === 0 && !isLoading ? (
        <Grid.EmptyView
          icon={Icon.Image}
          title="No Images Found"
          description={`No supported images found in "${imageDirectory}".`}
        />
      ) : (
        images.map((image) => (
          <Grid.Item
            key={image.path}
            content={{ source: image.path }}
            title={image.name}
            keywords={[image.name]}
            actions={
              <ActionPanel>
                <Action
                  title="Copy to Clipboard"
                  icon={Icon.Clipboard}
                  onAction={() => copyImageAsClipboard(image.path, image.name)}
                />
                <Action.ShowInFinder path={image.path} />
                <Action.Open title="Open Image" target={image.path} />
                <Action.CopyToClipboard
                  title="Copy File Path"
                  content={image.path}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </Grid>
  );
}
