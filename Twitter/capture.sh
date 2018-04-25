#!/bin/sh


#sudo $SPARK_HOME/bin/spark-shell --jars $SPARK_HOME/lib/twitter4j-core-4.0.6.jar, $SPARK_HOME/lib/twitter4j-async-4.0.6.jar, $SPARK_HOME/lib/twitter4j-stream-4.0.6.jar, $SPARK_HOME/lib/twitter4j-media-support-4.0.6.jar --packages com.github.master:spark-stemming_2.10:0.2.0,org.apache.bahir:spark-streaming-twitter_2.11:2.2.0 -i /home/centos/Twitter/getting.java

##delete others files
sudo rm -r /home/centos/Twitter/collect/.*
sudo rm -r /home/centos/Twitter/collect/_*

##find and replace \tlocation
sudo sed -i -e 's.\\tlocation:.","location":".g' /home/centos/Twitter/collect/*

##find and replace \tdate
sudo sed -i -e 's.\\tdate:.","date":".g' /home/centos/Twitter/collect/*

##find and replace /2018
sudo sed -i -e 's.\/2018 ./2018","time":".g' /home/centos/Twitter/collect/*

##find and replace \tfollowers
sudo sed -i -e 's.\\tfollowers:.","followers":.g' /home/centos/Twitter/collect/*

##find and replace \tuser
sudo sed -i -e 's.\\tuser:.,"user":".g' /home/centos/Twitter/collect/*

##find and replace \tname
sudo sed -i -e 's.\\tname:.","name":".g' /home/centos/Twitter/collect/*

##find and replace  ","
sudo sed -i -e 's.\ ",".",".g' /home/centos/Twitter/collect/*

##find and replace "01: but if the column have pm"
sudo sed -i -e '/ am",/s/"12:/"00:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"01:/"13:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"02:/"14:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"03:/"15:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"04:/"16:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"05:/"17:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"06:/"18:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"07:/"19:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"08:/"20:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"09:/"21:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"10:/"22:/g' /home/centos/Twitter/collect/*
sudo sed -i -e '/ pm",/s/"11:/"23:/g' /home/centos/Twitter/collect/*


##find and replace pm"
sudo sed -i -e 's/ pm"/"/g' /home/centos/Twitter/collect/*
sudo sed -i -e 's/ am"/"/g' /home/centos/Twitter/collect/*

#sudo $SPARK_HOME/bin/spark-shell --jars $SPARK_HOME/lib/twitter4j-core-4.0.6.jar, $SPARK_HOME/lib/twitter4j-async-4.0.6.jar, $SPARK_HOME/lib/twitter4j-stream-4.0.6.jar, $SPARK_HOME/lib/twitter4j-media-support-4.0.6.jar --packages com.github.master:spark-stemming_2.10:0.2.0,org.apache.bahir:spark-streaming-twitter_2.11:2.2.0 -i /home/centos/Twitter/processing.java	