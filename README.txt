Projekti käivitamise juhend


Praegu on projektis 6 lehekülge, kõikidel on olemas navigeerimisriba, kõik on responsiivsed.

leheküljed:

-index - siin on logo, esialgne tervitus, ja "create" nupp. kui kasutaja klikib nuppu,
siis veebileht peab vaatama, kas ta on sisse logitud. kui ei -> viidab Log in lehele, kui jah -> viidab
create lehele (hetkel viidab create lehele ükskõik kas ta on sisse logitud või ei)
-log in - sisselogimine ning link register lehele
-register_page - konto loomine Firebase'i kaudu (hetkel ei ole funktsionaalne)
-create (hetkel ei ole funktsionaalne) - selles on kogu veebilehe mõte. kasutaja saab üles laadida oma seadmest fotot ennast, mida veebileht
hakkab töötlema, kui kasutaja vajutab "Create" nuppule. meie üritame rakendada Google Vision API nii, et ta valiks
LEGO detaile, mis näevad välja nagu inimene pildil. selleks andsime tags.txt failis LEGO detailidele kirjeldavaid
tag'e, millega Google Vision võrdleb saadud pildi, et leida parimad detailid 4-s kategoorias:
1) Hair
2) Face
3) Pants
4) Shirt
töödeldud LEGO detailide pildid asuvad legoParts kaustis. nendest leht peab koostama ühise pildi, ehk
kasutaja poolt loodud LEGO mehikest. juhul kui ei jõua projekti raames selle idee realiseerida,
hardcodime mingi konkreetse tulemuse, või teeme nii, et kasutaja saab ise valida detaile, millest
ehitab oma LEGO mehikest. kui kasutaja tahab, saab saadud pildi salvestada enda kollektsiooni, ehk "My Collection"
-my_collection - siit sisse logitud kasutaja näeb oma salvestatud LEGO mehiked
-about us - siia kirjutame infot projektist ning meist. oli ka idee genereerida oma LEGO mehikesi ning
panna fotod nendest siia