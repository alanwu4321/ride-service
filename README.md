## Rideshare API Service 🚗



<details>
  
 <summary>
<i>Architecture Overview</i>
</summary>

<br>
  <br>
 
![Schema](https://alan-wu.com/rideshare-design.png)

 </details>
 
 

  

### Mission

I have always enjoyed exploring problems that are true to our daily lives. In fact, rideshare has always been a preferable way to public transit owing to its affordability and efficiency. However, there has not been a solution to match passenger to those drivers who happen to be heading to the same destination as them. Most of us usually have to search countless Facebook posts and communicate with drivers for hours to find a ride. Indeed, Uber is always available, yet if one wants to travel long-distance, the passenger would have to pay almost twice or triple the price a rideshare driver would charge. Therefore, one of the projects I am working on currently is building a ReactJS ride share app to match student driver and passenger who shared the same destination.

The app backend would have a hybrid cloud for both containerized microservice and serverless architecture. For services that need to be timely and always accessible, such as searching and storing rideshare postings, I would have dockerized NodeJS servers and a persistent Mongo storage orchestrated by a Kubernetes cluster deployed on AWS EC2 that is load balanced by Nginx controller on AWS ELB. On the other hand, for services that are less commonly used, such as user authentication, I would have the server on AWS Lamda to save compute time and make it cost efficient. I am also going to implement a chatbot to serve as an assistant for the users under Azure Nature Language Understanding service.

### API Endpoints

```
POST /rides
GET /rides?origin=&destination=&startDate=&endDate=
GET /rides/:ride_id
GET /rides/:user_id/recommend
GET /rides/:user_id/upcoming
```

### Demo

https://alan-wu.com/rideshare-demo.mp4
