Vida Loca
=========

> Connecting people to places by challenging misconceptions.

With VidaLoca we’ve built a tool that enables you to find a place to live that matches to your values while also taking into account affordability, letting you live la vida loca (the crazy life). 
Our hope is that this tool connects you to places that closely match what you value in a community, place, or life style that you might not otherwise have considered. 

How do I do it?
---------------
1. Weigh a broad range of desirability data such as: 
   * education outcomes
   * access transport facilities 
   * local cafes culture 
   Don’t value a factor at all? Just turn it off.
2. We take your values and match them to the raw data on the Auckland region with a traffic light indicator highlighting your closest matches
3. Click on an area you want to know more about to find out what factors made it stand out to you!

[Click here to start using VidaLoca!](vidaloca.nz)

Some Code
---------

```
./foo.sh 2> >(tee stderr | tee -a combined) 1> >(tee stdout | tee -a combined)
UPDATE mastermesh mm JOIN masterrating mr ON mm.MB2013=mr.MB2013 SET mr.center_lat=mm.center_lat, mr.center_long=mm.center_long;
UPDATE stg_meshdata md JOIN masterrating mr ON md.MB2013=mr.MB2013 SET mr.polygon=md.WKT, mr.center_lat=md.center_lat, mr.center_long=md.center_long;
SELECT center_lat, center_long FROM masterrating WHERE center_lat IS NOT NULL and center_long IS NOT NULL  ORDER BY SQRT(POW(center_lat - -36.8,2)+ POW(center_long - 174.7, 2)) LIMIT 10;
sed -i.bak s/STRING_TO_REPLACE/STRING_TO_REPLACE_IT/g index.html

SELECT COUNT(1) FROM stg_meshdata md JOIN masterrating mr ON md.MB2013=mr.MB2013 WHERE md.center_lat IS NULL OR md.center_long IS NULL OR md.WKT IS NULL;
```
