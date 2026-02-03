#!/bin/bash
# This script flattens Drizzle Kit v1 beta migrations for Cloudflare D1
# It moves apps/web/migrations/<folder>/migration.sql to apps/web/migrations/<folder>.sql
# Issue: https://github.com/drizzle-team/drizzle-orm/issues/5166
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
migrations_dir="${script_dir}/apps/web/migrations"

if [ ! -d "$migrations_dir" ]; then
  echo "Migrations directory not found: $migrations_dir"
  exit 1
fi

shopt -s nullglob
for dir in "${migrations_dir}"/*/ ; do
  dir_name=$(basename "${dir%/}")
  
  # Skip meta folder
  if [ "$dir_name" == "meta" ]; then
    continue
  fi

  migration_file="${dir}migration.sql"
  
  if [ -f "$migration_file" ]; then
    target_file="${migrations_dir}/${dir_name}.sql"
    echo "Moving $migration_file to $target_file"
    mv "$migration_file" "$target_file"
  fi
done