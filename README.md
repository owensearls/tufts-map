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
