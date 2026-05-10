#!/usr/bin/env bash

OUTPUT_FILE="project_dump.txt"

rm -f "$OUTPUT_FILE"

echo "Generating project dump..."

find . -type f \
  ! -path "*/.git/*" \
  ! -name ".gitignore" \
  ! -path "*/node_modules/*" \
  ! -path "*/bin/*" \
  ! -path "*/obj/*" \
  ! -path "*/Migrations/*" \
  ! -name "*.http" \
  ! -name "*.log" \
  ! -name "appsettings.Development.json" \
  ! -name "package-lock.json" \
  ! -name "package.json" \
  ! -name ".gitattributes" \
  ! -name ".editorconfig" \
  ! -name ".DS_Store" \
  ! -name "*.sql" \
  ! -name "*.bak" \
  ! -name "*.md" \
  ! -name "project_dump.txt" \
| sort | while read -r file
do

    clean_path="${file#./}"

    echo "Dumping: $clean_path"

    {
        echo "FILE: $clean_path"
        if file "$file" | grep -qiE 'text|json|xml|shell script'; then
            cat "$file"
        else
            echo "[BINARY OR UNSUPPORTED FILE]"
        fi

        echo
        echo
    } >> "$OUTPUT_FILE"

done

echo
echo "Done."
echo "Saved to: $OUTPUT_FILE"
