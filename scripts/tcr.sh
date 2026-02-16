#!/usr/bin/env bash
# TCR — Test && Commit || Revert
# Si los tests pasan, se hace commit automático.
# Si los tests fallan, se revierten todos los cambios no commiteados.

set -o pipefail

echo "🧪 Running tests..."
npx vitest run --reporter=default 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Tests passed — committing changes."
  git add -A && git commit -m "TCR: green"
else
  echo "❌ Tests failed — reverting changes."
  git checkout .
  git clean -fd
fi
