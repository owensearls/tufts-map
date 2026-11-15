#!/usr/bin/env bash
# Build clipped GeoJSON for each MassGIS Level 3 parcel vintage.
#
# Usage: scripts/build-data.sh RAW_DIR
#   RAW_DIR holds the extracted L3_SHP_M176_Medford_CYxx_FYyy/ and
#   L3_SHP_M274_Somerville_CYxx_FYyy/ folders (see README for where to get them).
# Writes data/20yy/tufts-<city>.json for every vintage found.
set -euo pipefail
RAW=${1:?usage: $0 RAW_DIR}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
MAPSHAPER=${MAPSHAPER:-mapshaper}

for dir in "$RAW"/L3_SHP_M*_*_CY*_FY*/; do
  name=$(basename "$dir")                       # L3_SHP_M176_Medford_CY26_FY26
  [[ $name =~ ^L3_SHP_(M[0-9]+)_([A-Za-z]+)_(CY[0-9]+_FY([0-9]+))$ ]] || continue
  town=${BASH_REMATCH[1]} city=${BASH_REMATCH[2],,} vint=${BASH_REMATCH[3]} fy=20${BASH_REMATCH[4]}
  out="$ROOT/data/$fy/tufts-$city.json"
  mkdir -p "$(dirname "$out")"
  echo "$name -> ${out#$ROOT/}"
  "$MAPSHAPER" -i "$dir/${town}TaxPar_$vint.shp" \
    -join "$dir/${town}Assess_$vint.dbf" keys="LOC_ID,LOC_ID" \
    -clean -simplify 10% -proj wgs84 \
    -clip "$ROOT/data/mask.json" \
    -o format=geojson "$out"
done
