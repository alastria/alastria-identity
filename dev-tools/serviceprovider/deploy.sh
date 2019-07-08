#!/bin/sh
mvn clean package -DskipTests=true
ssh serviceprovider "killall java"
scp target/serviceprovider-0.0.1-SNAPSHOT.jar serviceprovider:/home/ubuntu
ssh serviceprovider "nohup /usr/bin/java -jar serviceprovider-0.0.1-SNAPSHOT.jar > serviceprovider.log 2>&1 &"
