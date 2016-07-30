Vida Loca
=========

Things

./foo.sh 2> >(tee stderr | tee -a combined) 1> >(tee stdout | tee -a combined)
