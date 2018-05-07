  import org.apache.spark._
  import org.apache.spark.sql.functions.udf
  import org.apache.spark.sql.functions._  
  import org.apache.spark.rdd.RDD
  import org.apache.spark.ml.feature.{Tokenizer, StopWordsRemover, HashingTF, IDF}
  import org.apache.spark.mllib.feature.Stemmer
  import org.apache.spark.ml.classification.{LogisticRegression, LinearSVC, NaiveBayes}
  import org.apache.spark.ml.evaluation.BinaryClassificationEvaluator
  import org.apache.spark.ml.Pipeline
  import scala.collection.mutable.ArrayBuffer
  import org.apache.hadoop.fs._;


  
//READ ALL FILES IN THE DIRECTORY
  val df = spark.read.option("encoding","ISO-8859-1").json("/home/centos/Twitter/collect/")
  
//REMOVE SPECIAL CHARACTERS IN THE DATAFRAME
  def remove_leading1: String => String = _.replaceAll("""[\.]""", "")
  def remove_leading2: String => String = _.replaceAll("""[\p{Punct}&&[^.]]""", "")
  val udf_remove1 = udf(remove_leading1)
  val udf_remove2 = udf(remove_leading2)
  val df2 = df.withColumn("value", udf_remove1($"value")).withColumn("value", udf_remove2($"value"))

//**CREATE DATA TO EXPORT

  //Export map
      //Read file zone time-country
      case class Obs5( k1: String, k2: String)

      def parseObs5(line: Array[String]): Obs5 = {
        Obs5( line(0), line(1) ) }

      def parseRDD5(rdd: RDD[String]): RDD[Array[String]] = {
        rdd.map(_.split(",")).map(_.drop(0)).map(_.map(_.toString))}
      
      val rdd5 = sc.textFile("/home/centos/Twitter/paises.txt")

      val Obs5RDD = parseRDD5(rdd5).map(parseObs5)
      
      val df5 = Obs5RDD.toDF().cache()
  
  val df30  = df2.groupBy("location").count
  val df31  = df30.join(df5).where(df30("location")===df5("k1")).drop("location","k1").withColumnRenamed("k2","location")
  val df3   = df31.groupBy("location").sum().withColumnRenamed("sum(count)","count")
  val total = df2.where($"location"!=="null").count/5
  val b =  Array(total,total*2,total*3,total*4,total*5)
  val a =  Array(1,1+total*1,1+total*2,1+total*3,1+total*4,1+total*5)
  val dfcat0 = df3.where($"count">a(0)).where($"count"<b(0)).withColumn("cat",lit(1))
  
  val dfcat0 = df3.where($"location"==="null").withColumn("cat",lit(0))
  val dfcat1 = df3.where($"location"!=="null").where($"count">=a(0)).where($"count"<=b(0)).withColumn("cat",lit(1))
  val dfcat2 = df3.where($"location"!=="null").where($"count">=a(1)).where($"count"<=b(1)).withColumn("cat",lit(2))
  val dfcat3 = df3.where($"location"!=="null").where($"count">=a(2)).where($"count"<=b(2)).withColumn("cat",lit(3))
  val dfcat4 = df3.where($"location"!=="null").where($"count">=a(3)).where($"count"<=b(3)).withColumn("cat",lit(4))
  val dfcat5 = df3.where($"location"!=="null").where($"count">=a(4)).where($"count"<=b(4)).withColumn("cat",lit(5))
  
  val dfcat = dfcat0.union(dfcat1).union(dfcat2).union(dfcat3).union(dfcat4).union(dfcat5)
  
  dfcat.coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/map")
  val fs = FileSystem.get(sc.hadoopConfiguration);
  val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/map/part*"))(0).getPath().getName();
  fs.rename(new Path("/var/www/html/SentimentAnalytics/web/map/"+file), new Path("/var/www/html/SentimentAnalytics/web/map/map.json"));
  
  //export top positive tweets
  val df_pos_tweets = df2.where($"label"===1).select("value","user","followers").orderBy($"followers".desc).limit(3)
  df_pos_tweets.coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/PositivesTweets")
  val fs = FileSystem.get(sc.hadoopConfiguration);
  val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/PositivesTweets/part*"))(0).getPath().getName();
  fs.rename(new Path("/var/www/html/SentimentAnalytics/web/PositivesTweets/"+file), new Path("/var/www/html/SentimentAnalytics/web/PositivesTweets/positive.json"));
  
  //export top negative tweets
  val df_neg_tweets = df2.where($"label"===0).select("value","user","followers").orderBy($"followers".desc).limit(3)
  df_neg_tweets.coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/NegativesTweets")
  val fs = FileSystem.get(sc.hadoopConfiguration);
  val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/NegativesTweets/part*"))(0).getPath().getName();
  fs.rename(new Path("/var/www/html/SentimentAnalytics/web/NegativesTweets/"+file), new Path("/var/www/html/SentimentAnalytics/web/NegativesTweets/negative.json"));
  
  //export count positive tweets
  val pos_count =  df2.where($"label"===1).count
  Vector( pos_count.toDouble/df2.count*100).toDF.coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/PositiveCount")
  val fs = FileSystem.get(sc.hadoopConfiguration);
  val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/PositiveCount/part*"))(0).getPath().getName();
  fs.rename(new Path("/var/www/html/SentimentAnalytics/web/PositiveCount/"+file), new Path("/var/www/html/SentimentAnalytics/web/PositiveCount/positive.json"));
  
  //export count negative tweets
  val neg_count =  df2.where($"label"===0).count
  Vector( neg_count.toDouble/df2.count*100).toDF.coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/NegativeCount")
  val fs = FileSystem.get(sc.hadoopConfiguration);
  val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/NegativeCount/part*"))(0).getPath().getName();
  fs.rename(new Path("/var/www/html/SentimentAnalytics/web/NegativeCount/"+file), new Path("/var/www/html/SentimentAnalytics/web/NegativeCount/negative.json"));

  //export volumen tweets positivo y negativos
  val df_volumen_pos = df2.where($"label"===1).groupBy("date").count.withColumnRenamed("count","positivo")
  val df_volumen_neg = df2.where($"label"===0).groupBy("date").count.withColumnRenamed("count","negativo")
  
  df_volumen_pos.join(df_volumen_neg,"date").coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/Volumen")
  val fs = FileSystem.get(sc.hadoopConfiguration);
  val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/Volumen/part*"))(0).getPath().getName();
  fs.rename(new Path("/var/www/html/SentimentAnalytics/web/Volumen/"+file), new Path("/var/www/html/SentimentAnalytics/web/Volumen/vol.json"));

  //export volumen average tweets
  val df_vol = Vector(df2.count).toDF.withColumn("id", monotonicallyIncreasingId+1.toFloat	).withColumnRenamed("value","vol")
  val df_avg = Vector(df.count/df2.groupBy("date").count.count).toDF.withColumn("id", monotonicallyIncreasingId+1.toFloat	).withColumnRenamed("value","avg")
  df_vol.join(df_avg,"id").drop("id").coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/VolAvg")
  val fs = FileSystem.get(sc.hadoopConfiguration);
  val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/VolAvg/part*"))(0).getPath().getName();
  fs.rename(new Path("/var/www/html/SentimentAnalytics/web/VolAvg/"+file), new Path("/var/www/html/SentimentAnalytics/web/VolAvg/volavg.json"));
  
  //export tweets per hour
	   
    val df00 = df2.where($"time">="00:00:00").where($"time"<="00:59:59").groupBy("date").count.withColumn("time",lit("00:00:00"))
    val df01 = df2.where($"time">="01:00:00").where($"time"<="01:59:59").groupBy("date").count.withColumn("time",lit("01:00:00"))
    val df02 = df2.where($"time">="02:00:00").where($"time"<="02:59:59").groupBy("date").count.withColumn("time",lit("02:00:00"))
    val df03 = df2.where($"time">="03:00:00").where($"time"<="03:59:59").groupBy("date").count.withColumn("time",lit("03:00:00"))
    val df04 = df2.where($"time">="04:00:00").where($"time"<="04:59:59").groupBy("date").count.withColumn("time",lit("04:00:00"))
    val df05 = df2.where($"time">="05:00:00").where($"time"<="05:59:59").groupBy("date").count.withColumn("time",lit("05:00:00"))
    val df06 = df2.where($"time">="06:00:00").where($"time"<="06:59:59").groupBy("date").count.withColumn("time",lit("06:00:00"))
    val df07 = df2.where($"time">="07:00:00").where($"time"<="07:59:59").groupBy("date").count.withColumn("time",lit("07:00:00"))
    val df08 = df2.where($"time">="08:00:00").where($"time"<="08:59:59").groupBy("date").count.withColumn("time",lit("08:00:00"))
    val df09 = df2.where($"time">="09:00:00").where($"time"<="09:59:59").groupBy("date").count.withColumn("time",lit("09:00:00"))
    val df10 = df2.where($"time">="10:00:00").where($"time"<="10:59:59").groupBy("date").count.withColumn("time",lit("10:00:00"))
    val df11 = df2.where($"time">="11:00:00").where($"time"<="11:59:59").groupBy("date").count.withColumn("time",lit("11:00:00"))
    val df12 = df2.where($"time">="12:00:00").where($"time"<="12:59:59").groupBy("date").count.withColumn("time",lit("12:00:00"))
    val df13 = df2.where($"time">="13:00:00").where($"time"<="13:59:59").groupBy("date").count.withColumn("time",lit("13:00:00"))
    val df14 = df2.where($"time">="14:00:00").where($"time"<="14:59:59").groupBy("date").count.withColumn("time",lit("14:00:00"))
    val df15 = df2.where($"time">="15:00:00").where($"time"<="15:59:59").groupBy("date").count.withColumn("time",lit("15:00:00"))
    val df16 = df2.where($"time">="16:00:00").where($"time"<="16:59:59").groupBy("date").count.withColumn("time",lit("16:00:00"))
    val df17 = df2.where($"time">="17:00:00").where($"time"<="17:59:59").groupBy("date").count.withColumn("time",lit("17:00:00"))
    val df18 = df2.where($"time">="18:00:00").where($"time"<="18:59:59").groupBy("date").count.withColumn("time",lit("18:00:00"))
    val df19 = df2.where($"time">="19:00:00").where($"time"<="19:59:59").groupBy("date").count.withColumn("time",lit("19:00:00"))
    val df20 = df2.where($"time">="20:00:00").where($"time"<="20:59:59").groupBy("date").count.withColumn("time",lit("20:00:00"))
    val df21 = df2.where($"time">="21:00:00").where($"time"<="21:59:59").groupBy("date").count.withColumn("time",lit("21:00:00"))
    val df22 = df2.where($"time">="22:00:00").where($"time"<="22:59:59").groupBy("date").count.withColumn("time",lit("22:00:00"))
    val df23 = df2.where($"time">="23:00:00").where($"time"<="23:59:59").groupBy("date").count.withColumn("time",lit("23:00:00"))
    
    val df_time = df00.union(df01).union(df02).union(df03).union(df04).union(df05).union(df06).union(df07).union(df08).union(df09).union(df10).union(df11).union(df12).union(df13).union(df14).union(df15).union(df16).union(df17).union(df18).union(df19).union(df20).union(df21).union(df22).union(df23)
    
    df_time.orderBy("date","time").coalesce(1).write.mode("overwrite").json("/var/www/html/SentimentAnalytics/web/TweetsHour")
    val fs = FileSystem.get(sc.hadoopConfiguration);
    val file = fs.globStatus(new Path("/var/www/html/SentimentAnalytics/web/TweetsHour/part*"))(0).getPath().getName();
    fs.rename(new Path("/var/www/html/SentimentAnalytics/web/TweetsHour/"+file), new Path("/var/www/html/SentimentAnalytics/web/TweetsHour/hour.json"));
    

////**PREDICTIONS MODELS**
//
//  //DEFINE TRAINING AND TEST DATA
//  val Array(trainingData, testData) = df2.randomSplit(Array(0.7, 0.4),5043)
//
//  //LOAD DICTIONARY 
//  val filter = StopWordsRemover.loadDefaultStopWords("spanish")
//
//  //DEFINE STAGES OF THE PIPELINE 
//  val tokenizer = new Tokenizer().setInputCol("value").setOutputCol("words")
//  val remover = new StopWordsRemover().setInputCol("words").setOutputCol("removed").setStopWords(filter)
//  val stemmer = new Stemmer().setInputCol("removed").setOutputCol("stemmed").setLanguage("Spanish")
//  val hashingTF = new HashingTF().setInputCol("stemmed").setOutputCol("rawFeatures").setNumFeatures(128)
//  val idf = new IDF().setInputCol("rawFeatures").setOutputCol("features")
//
////VARIABLES
//
//  //Logistic Regression
//   val bestf1scorelr    	  = new ArrayBuffer[Double]()
//   val bestespelr      	  = new ArrayBuffer[Double]()
//   val bestsencilr    	    = new ArrayBuffer[Double]()
//   val bestpreclr      	  = new ArrayBuffer[Double]()
//   val bestnpreclr     	  = new ArrayBuffer[Double]()
//   val besttruePlr     	  = new ArrayBuffer[Double]()
//   val besttrueNlr     	  = new ArrayBuffer[Double]()
//   val bestfalsePlr    	  = new ArrayBuffer[Double]()
//   val bestfalseNlr    	  = new ArrayBuffer[Double]()
//   val bestROClr     	    = new ArrayBuffer[Double]()
//   val bestReglr          = new ArrayBuffer[Double]()
//    
//   bestf1scorelr  += 0
//   
// //SVM
//   val bestf1scoresvm    	  = new ArrayBuffer[Double]()
//   val bestespesvm     	    = new ArrayBuffer[Double]()
//   val bestsencisvm    	    = new ArrayBuffer[Double]()
//   val bestprecsvm      	  = new ArrayBuffer[Double]()
//   val bestnprecsvm     	  = new ArrayBuffer[Double]()
//   val besttruePsvm     	  = new ArrayBuffer[Double]()
//   val besttrueNsvm     	  = new ArrayBuffer[Double]()
//   val bestfalsePsvm    	  = new ArrayBuffer[Double]()
//   val bestfalseNsvm    	  = new ArrayBuffer[Double]()
//   val bestROCsvm     	    = new ArrayBuffer[Double]()
//   val bestRegsvm            = new ArrayBuffer[Double]()
//   
//   bestf1scoresvm  += 0
//   
// //Naive Bayes
//   val bestf1scorenb    	= new ArrayBuffer[Double]()
//   val bestespenb     	  = new ArrayBuffer[Double]()
//   val bestsencinb    	  = new ArrayBuffer[Double]()
//   val bestprecnb      	  = new ArrayBuffer[Double]()
//   val bestnprecnb     	  = new ArrayBuffer[Double]()
//   val besttruePnb     	  = new ArrayBuffer[Double]()
//   val besttrueNnb     	  = new ArrayBuffer[Double]()
//   val bestfalsePnb    	  = new ArrayBuffer[Double]()
//   val bestfalseNnb    	  = new ArrayBuffer[Double]()
//   val bestROCnb     	    = new ArrayBuffer[Double]()
//   val bestRegnb          = new ArrayBuffer[Double]()
//   
//   bestf1scorenb  += 0
//   
//for (b<-0 to 10)
//{
//			val RegParam = b*0.1
//    
//			
//      //Logistic regression Model
//      val lr = new LogisticRegression().setMaxIter(1000).setRegParam(RegParam).setFeaturesCol("features").setLabelCol("label")
//      //SVM Model
//      val lsvm = new LinearSVC().setMaxIter(1000).setRegParam(RegParam).setFeaturesCol("features").setLabelCol("label")
//      //Naive Bayes Model
//      val nb = new NaiveBayes()
//
//      
//      //logistic regression Pipeline
//      val pipelinelr  = new Pipeline().setStages(Array(tokenizer, remover, stemmer, hashingTF, idf, lr))
//      //SVM Pipeline
//      val pipelinesvm = new Pipeline().setStages(Array(tokenizer, remover, stemmer, hashingTF, idf, lsvm))
//      //Naive Bayes Pipeline
//      val pipelinenb = new Pipeline().setStages(Array(tokenizer, remover, stemmer, hashingTF, idf, nb))
//      
//      
//      //Logistic Regression Fit Model
//      val modellr  = pipelinelr.fit(trainingData)
//      //SVM Fit Model
//      val modelsvm = pipelinesvm.fit(trainingData)
//      //Naive Bayes Fit Model
//      val modelnb = pipelinenb.fit(trainingData)
//      
//      
//      //Logistic Regression Test Model
//      val predictionslr  = modellr.transform(testData)
//      //SVM Test Model
//      val predictionssvm = modelsvm.transform(testData)
//      //Naive Bayes Test Model
//      val predictionsnb = modelnb.transform(testData)
//      
//      
//      //Evaluator Models
//      val evaluator = new BinaryClassificationEvaluator().setLabelCol("label").setRawPredictionCol("prediction")
//      
//      //Logistic Regression Evaluation
//      val lplr = predictionslr.select( "label", "prediction")
//      
//      val truePlr  = lplr.filter($"prediction" === 1.0).filter($"label" === $"prediction").count().toDouble
//      val trueNlr  = lplr.filter($"prediction" === 0.0).filter($"label" === $"prediction").count().toDouble
//      val falseNlr = lplr.filter($"prediction" === 0.0).filter(not($"label" === $"prediction")).count().toDouble
//      val falsePlr = lplr.filter($"prediction" === 1.0).filter(not($"label" === $"prediction")).count().toDouble
//      
//      val especlr = trueNlr/(trueNlr+falsePlr)
//      val sensilr = truePlr/(truePlr+falseNlr)
//      val precilr = truePlr/(truePlr+falsePlr)
//      val npreclr = trueNlr/(trueNlr+falseNlr)
//      
//      val f1scorelr    = 2*(precilr*sensilr)/(precilr+sensilr)
//      val area_under_ROClr = evaluator.evaluate(predictionslr)
//      
//      //SVM Evaluation
//      val lpsvm = predictionssvm.select( "label", "prediction")
//
//      val truePsvm  = lpsvm.filter($"prediction" === 1.0).filter($"label" === $"prediction").count().toDouble
//      val trueNsvm  = lpsvm.filter($"prediction" === 0.0).filter($"label" === $"prediction").count().toDouble
//      val falseNsvm = lpsvm.filter($"prediction" === 0.0).filter(not($"label" === $"prediction")).count().toDouble
//      val falsePsvm = lpsvm.filter($"prediction" === 1.0).filter(not($"label" === $"prediction")).count().toDouble
//
//      val especsvm = trueNsvm/(trueNsvm+falsePsvm)
//      val sensisvm = truePsvm/(truePsvm+falseNsvm)
//      val precisvm = truePsvm/(truePsvm+falsePsvm)
//      val nprecsvm = trueNsvm/(trueNsvm+falseNsvm)
//
//      val f1scoresvm    = 2*(precisvm*sensisvm)/(precisvm+sensisvm)
//      val area_under_ROCsvm = evaluator.evaluate(predictionssvm)
//    
//      //Naive Bayes Evaluation
//      val lpnb = predictionsnb.select( "label", "prediction")
//
//      val truePnb  = lpnb.filter($"prediction" === 1.0).filter($"label" === $"prediction").count().toDouble
//      val trueNnb  = lpnb.filter($"prediction" === 0.0).filter($"label" === $"prediction").count().toDouble
//      val falseNnb = lpnb.filter($"prediction" === 0.0).filter(not($"label" === $"prediction")).count().toDouble
//      val falsePnb = lpnb.filter($"prediction" === 1.0).filter(not($"label" === $"prediction")).count().toDouble
//
//      val especnb = trueNnb/(trueNnb+falsePnb)
//      val sensinb = truePnb/(truePnb+falseNnb)
//      val precinb = truePnb/(truePnb+falsePnb)
//      val nprecnb = trueNnb/(trueNnb+falseNnb)
//
//      val f1scorenb    = 2*(precinb*sensinb)/(precinb+sensinb)
//      val area_under_ROCnb = evaluator.evaluate(predictionsnb)
//    
//      //Logistic Regression Best Model
//      if( f1scorelr > bestf1scorelr.last)
//      			{
//                bestf1scorelr	  +=   f1scorelr
//                bestespelr  	  +=   especlr
//                bestsencilr  	  +=   sensilr
//                bestpreclr  	  +=   precilr
//                bestnpreclr  	  +=   npreclr
//                besttruePlr  	  +=   truePlr
//                besttrueNlr  	  +=   trueNlr
//                bestfalsePlr 	  +=   falsePlr
//                bestfalseNlr 	  +=   falseNlr
//                bestROClr       +=   area_under_ROClr
//                bestReglr       +=   RegParam
//                 }
//            
//      //SVM Best Model
//      if( f1scoresvm > bestf1scoresvm.last)
//      			{
//                bestf1scoresvm	+=   f1scoresvm
//                bestespesvm 	  +=   especsvm
//                bestsencisvm    +=   sensisvm
//                bestprecsvm     +=   precisvm
//                bestnprecsvm 	  +=   nprecsvm
//                besttruePsvm  	+=   truePsvm
//                besttrueNsvm 	  +=   trueNsvm
//                bestfalsePsvm 	+=   falsePsvm
//                bestfalseNsvm 	+=   falseNsvm
//                bestROCsvm      +=   area_under_ROCsvm    
//                bestRegsvm      +=   RegParam
//             }
//             
//      //Naive Bayes Best Model
//      if( f1scorenb > bestf1scorenb.last)
//      			{
//                bestf1scorenb	+=   f1scorenb
//                bestespenb 	  +=   especnb
//                bestsencinb   +=   sensinb
//                bestprecnb    +=   precinb
//                bestnprecnb 	+=   nprecnb
//                besttruePnb  	+=   truePnb
//                besttrueNnb 	+=   trueNnb
//                bestfalsePnb 	+=   falsePnb
//                bestfalseNnb 	+=   falseNnb
//                bestROCnb     +=   area_under_ROCnb    
//                bestRegnb     +=   RegParam
//             }
//  
//}
//
//println("")
//println("*********RESULTS LR")
//println("******")
//println("***")
//
//
//println("F1 score is      :  "+bestf1scorelr.last)
//println("ROC              :  "+bestROClr.last)
//println("Specificity is   :  "+bestespelr.last)
//println("Sensitivity is   :  "+bestsencilr.last)
//println("Precision        :  "+bestpreclr.last)
//println("Neg. Precision   :  "+bestnpreclr.last)
//println("True Pos.        :  "+besttruePlr.last)
//println("True Neg.        :  "+besttrueNlr.last)
//println("False Pos.       :  "+bestfalsePlr.last)
//println("False Neg.       :  "+bestfalseNlr.last)
//println("*")
//println("***")
//println("******")
//println("*********")
//
//println("")
//println("*********RESULTS SVM")
//println("******")
//println("***")
//
//
//println("F1 score is      :  "+bestf1scoresvm.last)
//println("ROC              :  "+bestROCsvm.last)
//println("Specificity is   :  "+bestespesvm.last)
//println("Sensitivity is   :  "+bestsencisvm.last)
//println("Precision        :  "+bestprecsvm.last)
//println("Neg. Precision   :  "+bestnprecsvm.last)
//println("True Pos.        :  "+besttruePsvm.last)
//println("True Neg.        :  "+besttrueNsvm.last)
//println("False Pos.       :  "+bestfalsePsvm.last)
//println("False Neg.       :  "+bestfalseNsvm.last)
//println("*")
//println("***")
//println("******")
//println("*********")
//
//println("")
//println("*********RESULTS NAIVE BAYES")
//println("******")
//println("***")
//
//
//println("F1 score is      :  "+bestf1scorenb.last)
//println("ROC              :  "+bestROCnb.last)
//println("Specificity is   :  "+bestespenb.last)
//println("Sensitivity is   :  "+bestsencinb.last)
//println("Precision        :  "+bestprecnb.last)
//println("Neg. Precision   :  "+bestnprecnb.last)
//println("True Pos.        :  "+besttruePnb.last)
//println("True Neg.        :  "+besttrueNnb.last)
//println("False Pos.       :  "+bestfalsePnb.last)
//println("False Neg.       :  "+bestfalseNnb.last)
//println("*")
//println("***")
//println("******")
//println("*********")

System.exit(0) 