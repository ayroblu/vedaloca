Vida Loca
=========

Things

```
./foo.sh 2> >(tee stderr | tee -a combined) 1> >(tee stdout | tee -a combined)
UPDATE mastermesh mm JOIN masterrating mr ON mm.MB2013=mr.MB2013 SET mr.center_lat=mm.center_lat, mr.center_long=mm.center_long;
UPDATE stg_meshdata md JOIN masterrating mr ON md.MB2013=mr.MB2013 SET mr.center_lat=md.center_lat, mr.center_long=md.center_long;
SELECT center_lat, center_long FROM masterrating WHERE center_lat IS NOT NULL and center_long IS NOT NULL  ORDER BY SQRT(POW(center_lat - -36.8,2)+ POW(center_long - 174.7, 2)) LIMIT 10;
sed -i.bak s/STRING_TO_REPLACE/STRING_TO_REPLACE_IT/g index.html
```
