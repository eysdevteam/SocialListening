import org.apache.spark._
import org.apache.spark.streaming._
import org.apache.spark.streaming.twitter._
import org.apache.spark.sql.functions.udf
import org.apache.spark.sql.functions._
import twitter4j.conf.ConfigurationBuilder    
import twitter4j.auth.OAuthAuthorization    
import org.apache.spark.ml.feature.{Tokenizer, StopWordsRemover, HashingTF, IDF}
import org.apache.spark.mllib.feature.Stemmer
import org.apache.spark.ml.classification.{LogisticRegression}
import org.apache.spark.ml.evaluation.BinaryClassificationEvaluator
import org.apache.spark.ml.Pipeline
import org.apache.hadoop.fs._;

// set Twitter oauth properties
val cb = new ConfigurationBuilder    

cb.setDebugEnabled(true).setTweetModeExtended(true).setOAuthConsumerKey("2AvbG84msbL34BEHslMsWZTUR").    
      setOAuthConsumerSecret("gzEENqmZoMl2hhHvDIdaWzIF9ShMSLO0o7gh8csZnfqKdK6Y9H").    
      setOAuthAccessToken("14113114-1we8sJQs1z54dWfjWbUwZtDtkQYf3kDOrXLUMBFkZ").    
      setOAuthAccessTokenSecret("6Sq95ezVVRNTuLw7grKzm4czA32VqmlM0QwvaLjWLNl5A")
	
val auth = new OAuthAuthorization(cb.build)    

// create stream
val filters = Seq("@IvanDuque")
sc.setLogLevel("ERROR") 
val ssc = new StreamingContext(sc, Seconds(5))  
val stream = TwitterUtils.createStream(ssc, Some(auth),filters)    

  val tweets = stream.map(tweet => {
        val time = tweet.getCreatedAt.toLocaleString
        val text = tweet.getText.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ')
        val followers =  tweet.getUser.getFollowersCount
        val latitude = Option(tweet.getGeoLocation).map(l => s"${l.getLatitude},${l.getLongitude}")
        val place    = Option(tweet.getPlace).map(_.getName)
        val location = latitude.getOrElse(place.getOrElse("null"))
        val country  = Option(tweet.getPlace).map(_.getCountryCode).orNull
	      val name     =  tweet.getUser.getName
        val user     =  tweet.getUser.getScreenName
        val n_name      = "name:"
        val n_user      = "user:"
        val n_location  = "location:"
        val n_date      = "date:"
        val n_followers = "followers:" 
        val space       = " "
        s"$text$space\t$n_location$country$space\t$n_date$time$space\t$n_followers$followers\t$n_user$user\t$n_name$name"
      })

val filtered = tweets.map(_.toLowerCase).filter(word => !word.startsWith("rt"))

filtered.foreachRDD(rdd => {
    rdd.foreach(println)
    if (!rdd.isEmpty()) {
       rdd.toDF("value").coalesce(1).write.mode("append").json("/home/centos/Twitter/data/")
    }
})


// start
ssc.start
// define sleep
val time = 1000*100
ssc.awaitTerminationOrTimeout(time)
// stop 
ssc.stop(false, true)

val date = java.time.LocalDateTime.now.toString.replace(".","").replace(":","")

//READ ALL FILES IN THE DIRECTORY
val df = spark.read.option("encoding","ISO-8859-1").json("/home/centos/Twitter/data/")
df.coalesce(1).write.mode("overwrite").json("/home/centos/Twitter/collect/")
val fs = FileSystem.get(sc.hadoopConfiguration);
val file = fs.globStatus(new Path("/home/centos/Twitter/collect/part*"))(0).getPath().getName();
fs.rename(new Path("/home/centos/Twitter/collect/"+file), new Path("/home/centos/Twitter/collect/"+date+".json"));

System.exit(0) 

