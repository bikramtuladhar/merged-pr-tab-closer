#!/usr/bin/env bash
# Builds the zip to upload to the Chrome Web Store.
set -euo pipefail
cd "$(dirname "$0")/.."
version=$(python3 -c 'import json;print(json.load(open("manifest.json"))["version"])')
mkdir -p dist
out="dist/merged-pr-tab-closer-$version.zip"
rm -f "$out"
zip -X -r "$out" manifest.json background.js content.js shared.js icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png
echo "Built $out"
