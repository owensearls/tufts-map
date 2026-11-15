# tufts-map
A map of land ownership around the Tufts University Medford/Somerville campus.

## Source Data
All data from [MassGIS](https://docs.digital.mass.gov/dataset/massgis-data-standardized-assessors-parcels).

The geojson files for this project were created from the original shape files
using [mapshaper](https://github.com/mbloch/mapshaper) and
[geojson-merge](https://github.com/mapbox/geojson-merge).

```shell
mapshaper -i *TaxPar.shp -join *Assess.dbf keys="LOC_ID,LOC_ID" \
-clean -simplify 10% -proj wgs84 -o format=geojson out.json
```

The files for each city were then clipped to a mask of the area area around Tufts.

```shell
mapshaper -rectangle bbox="-71.133,42.397,-71.100,42.417" -proj wgs84 -o format=geojson mask.geojson
mapshaper in.json -clip mask.json -o out.json
```

## Available years

MassGIS publishes a new parcel vintage only when a city submits one, so the
fiscal years differ by city:

| City       | Fiscal years                               |
|------------|--------------------------------------------|
| Medford    | 2012, 2019, 2020, 2023, 2024, 2025, 2026   |
| Somerville | 2013, 2019, 2020, 2021, 2023, 2024, 2025   |

The map has a year selector. When a city has no data for the chosen year,
it shows that city's closest earlier vintage and says so on the map.

Note: `data/2018/` actually contains FY2012 (Medford) and FY2013 (Somerville)
data, the same vintages as `data/2012/` and `data/2013/`.

## Rebuilding the data

Every historical vintage is bundled in MassGIS's statewide aggregate download
(`https://s3.us-east-1.amazonaws.com/download.massgis.digital.mass.gov/shapefiles/l3parcels/L3_AGGREGATE_SHP_<date>.zip`,
~7 GB). Extract the `L3_SHP_M176_Medford_*` and `L3_SHP_M274_Somerville_*`
folders into one directory, then run:

```shell
scripts/build-data.sh path/to/extracted
```

This runs the mapshaper join/simplify/clip steps above for every vintage and
writes `data/<fiscal year>/tufts-<city>.json`.
