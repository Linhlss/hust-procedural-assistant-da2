#!/bin/zsh
# Biên dịch tại thư mục source. PDF ở thư mục gốc liên kết tới main.pdf này.
set -eu
report_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
export PATH="/Library/TeX/texbin:/usr/local/texlive/2026/bin/universal-darwin:$PATH"
cd -- "$report_dir"
if ! command -v latexmk >/dev/null 2>&1 || ! command -v xelatex >/dev/null 2>&1; then
  echo "Cần MacTeX hoặc TeX Live có XeLaTeX và latexmk để biên dịch báo cáo."
  exit 1
fi
latexmk -norc -xelatex -synctex=1 -interaction=nonstopmode -halt-on-error main.tex
workspace_dir="$(cd -- "$report_dir/../.." && pwd)"
ln -sfn "Artifact_De_tai_chinh/Bao_cao_tuan_5_LaTeX/main.pdf" "$workspace_dir/Tuan5_Student.pdf"
if (( $# == 0 )) || [[ "$1" != "--no-open" ]]; then
  open "$report_dir/main.pdf"
fi
