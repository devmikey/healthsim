
# HealthSim

Healthsim is a simulator project for INTEROpen that is being developed to help the INTEROpen developer community design and develop solutions for the NHS

Healthsim uses [Charlie McCays](https://github.com/charliemccay) Simulation tool called CADE to simulate a health and care pathway - [CADE](https://github.com/charliemccay/cade-meds1) generates synthetic events based on a BPMN pathway. These events are pushed into Healthsim -  [Apache Kafka](https://www.confluent.io/what-is-apache-kafka. 

**Why Kafka**

Kafka stores these events in a log, enabling the data to be reused for the many purposes:

1. Data transformation - to convert data from its source format into a different target format such as FHIR, OpenEHR, HL7v2 - this is beneficial because it means we can share data with systems using different interoperability standards. CADE provides a set of exhaust templates to create the source data in the preferred format so we can model the "As Is" state or "To be" state and then apply a set of transformations to produce the target data in the format(s) desired
2. Analytics - Use elasticsearch and Kibana to visualise the data stream in real time - for example to show admissions or discharges from a hospital. This is beneficial because it allows us to explore our care pathway end to end from a commissioners perspective and provide just in time analytics.
3. Data ingestion - Use Debezium to stream changes from your databases using log based changed data capture and the mailbox box pattern. This is beneficial because it can turn your databases into event sources without impacting end users
4. Machine learning - Need to train algorithms? Bring the data into Kafka so you have a single ingestion pipeline and push into H20.AI or Tensorflow . This is beneficial because you simplify the process of obtaining and cleansing the data
5.  Record location - Use KSQLDB to provide a up to date state of an event stream such as current immunisations taken by a child - this is beneficial because it allows us to take an event stream and reflect the current state about those events
6. Triggering alerts - Use KSQLDB to identify anomalies in data - such as when overlapping clinical events occur over a window off time and trigger an activity. This is beneficial because it allows us to develop decision support algorithms that can operate across multiple sources of information across a window in time.
7. Avoid dual writes - Kafka provides an eventual consistency pattern. This is beneficial because we can push data into Kafka and be confident that data will eventually be consistent at the destination irrespective of whether the source or destination target has downtime. This is beneficial because it removes the problem with dual writes which can lead to data corruption 

**Install instructions for Healthsim**

Clone Healthsim from your development root directory
git clone https://github.com/devmikey/healthsim.git
cd healthsim
docker-compose up

Healthsim will install the following Docker images:

1. kibana
2. elasticsearch
3. ksqldb-cli
4. ksqldb-server
5. kafka-topics-ui
6. kafka-rest-proxy
7. schema-registry-ui
8. schema-registry
9. Kafka broker
10. zookeeper

Healthsim comes bundled with Elasticsearch and Kibana to visualise data. To get this working you need to install the Elasticsearch Kafka Connector sink after you have installed Healthsim

From a separate command line run the batch file:

ksql-cli.bat
or run run the ksqldb-cli directly
docker exec -it ksqldb-cli ksql http://ksqldb-server:8088

At the ksql> prompt enter:

CREATE SINK CONNECTOR patient_writer WITH (
    'connector.class' = 'io.confluent.connect.elasticsearch.ElasticsearchSinkConnector',
    'connection.url' = 'http://elasticsearch:9200',
    'type.name' = 'kafka-connect',
    'topics' = 'Patient,Condition,Observation',
    'value.converter' = 'org.apache.kafka.connect.json.JsonConverter',
    'value.converter.schemas.enable' = 'false',
    'key.converter' = 'org.apache.kafka.connect.json.JsonConverter',
    'key.converter.schemas.enable' = 'false',
    'schema.ignore' = 'true'
);

If all goes well you should receive the message

 **Created connector PATIENT_WRITER**

You should now be able to navigate to Kibana at [http://localhost:5601/](http://localhost:5601/)

**Install instructions for CADE**
To push events into Healthsim you will need to install and run CADE

Clone CADE from your development root
git clone https://github.com/charliemccay/cade-meds1.git
docker run -v $(pwd)/Resources:/app/Resources --network="host" ramseysys/cade2r3 start.py`

If all has gone well CADE will have created a set of events and pushed them to the Healthsim