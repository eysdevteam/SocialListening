sudo $SPARK_HOME/bin/spark-shell --packages com.github.master:spark-stemming_2.10:0.2.0,org.apache.bahir:spark-streaming-twitter_2.11:2.2.0 -i /home/centos/Twitter/processing.java

#Negative count
sudo sed -i -e 's/}/]/g' /var/www/html/SentimentAnalytics/web/NegativeCount/negative.json
sudo sed -i -e 's/{"value":/[/g' /var/www/html/SentimentAnalytics/web/NegativeCount/negative.json

#Positive count
sudo sed -i -e 's/}/]/g' /var/www/html/SentimentAnalytics/web/PositiveCount/positive.json
sudo sed -i -e 's/{"value":/[/g' /var/www/html/SentimentAnalytics/web/PositiveCount/positive.json

#Positve Top
sudo sed -i '$!s/$/,/'  /var/www/html/SentimentAnalytics/web/PositivesTweets/positive.json ##coma en todas excepto la ultima
sudo sed -i '1s/^/[/'   /var/www/html/SentimentAnalytics/web/PositivesTweets/positive.json ##[ al comienzo del archivo
sudo sed -i "\$a]"      /var/www/html/SentimentAnalytics/web/PositivesTweets/positive.json ##]al finnal

#Negatve Top
sudo sed -i '$!s/$/,/'  /var/www/html/SentimentAnalytics/web/NegativesTweets/negative.json ##coma en todas excepto la ultima
sudo sed -i '1s/^/[/'   /var/www/html/SentimentAnalytics/web/NegativesTweets/negative.json ##[ al comienzo del archivo
sudo sed -i "\$a]"      /var/www/html/SentimentAnalytics/web/NegativesTweets/negative.json ##]al finnal

##Vol Avg
sudo sed -i '$!s/$/,/'  /var/www/html/SentimentAnalytics/web/VolAvg/volavg.json ##coma en todas excepto la ultima
sudo sed -i '1s/^/[/'   /var/www/html/SentimentAnalytics/web/VolAvg/volavg.json ##[ al comienzo del archivo
sudo sed -i "\$a]"      /var/www/html/SentimentAnalytics/web/VolAvg/volavg.json ##]al finnal

##Map
sudo sed -i '$!s/$/,/'  /var/www/html/SentimentAnalytics/web/map/map.json ##coma en todas excepto la ultima
sudo sed -i '1s/^/[/'   /var/www/html/SentimentAnalytics/web/map/map.json ##[ al comienzo del archivo
sudo sed -i "\$a]"      /var/www/html/SentimentAnalytics/web/map/map.json ##]al finnal

##Hour
sudo sed -i '$!s/$/,/'  /var/www/html/SentimentAnalytics/web/TweetsHour/hour.json ##coma en todas excepto la ultima
sudo sed -i '1s/^/[/'   /var/www/html/SentimentAnalytics/web/TweetsHour/hour.json ##[ al comienzo del archivo
sudo sed -i "\$a]"      /var/www/html/SentimentAnalytics/web/TweetsHour/hour.json ##]al finnal

##Volumen
sudo sed -i '$!s/$/,/'  /var/www/html/SentimentAnalytics/web/Volumen/vol.json ##coma en todas excepto la ultima
sudo sed -i '1s/^/[/'   /var/www/html/SentimentAnalytics/web/Volumen/vol.json ##[ al comienzo del archivo
sudo sed -i "\$a]"      /var/www/html/SentimentAnalytics/web/Volumen/vol.json ##]al finnal

sudo rm -r /var/www/html/SentimentAnalytics/es/web
sudo cp -r /var/www/html/SentimentAnanytics/web /var/www/html/SentimentAnalytics/es/

