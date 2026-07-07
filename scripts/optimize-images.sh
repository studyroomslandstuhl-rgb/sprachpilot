#!/bin/bash
set -e

echo "SprachPilot Image Optimizer"
echo "================================"

command -v optipng >/dev/null 2>&1 || { echo "optipng not found"; exit 1; }
command -v pngquant >/dev/null 2>&1 || { echo "pngquant not found"; exit 1; }

echo ""
echo "Compressing PNG files..."
echo ""

find . -type f -name "*.png" ! -path './node_modules/*' ! -path './.git/*' | while read file; do
  original_size=$(stat -c%s "$file")
  echo -n "  Processing $file... "

  optipng -o2 -quiet "$file" 2>/dev/null || true
  pngquant --quality=75-90 --speed=1 --force --output="${file}.tmp" "$file" 2>/dev/null || true
  [ -f "${file}.tmp" ] && mv "${file}.tmp" "$file"

  new_size=$(stat -c%s "$file")
  if [ "$original_size" -gt 0 ]; then
    reduction=$(( (original_size - new_size) * 100 / original_size ))
    echo "reduced by ${reduction}%"
  else
    echo "processed"
  fi
done

echo ""
echo "Compression complete!"
