#!/bin/zsh
# Biên dịch đầy đủ tại chính thư mục source; PDF chính là main.pdf.
set -eu
report_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
export PATH="/Library/TeX/texbin:/usr/local/texlive/2026/bin/universal-darwin:$PATH"
cd -- "$report_dir"
if ! command -v latexmk >/dev/null 2>&1; then
  echo "Không tìm thấy latexmk. Cần cài MacTeX/TeX Live có pdfLaTeX và Biber."
  exit 1
fi
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
if [[ "${1:-}" != "--no-open" ]]; then
  open "$report_dir/main.pdf"
fi
