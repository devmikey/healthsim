const { Kafka } = require('kafkajs')
const fs = require('fs')

var messages = []
messages.push({key:"key1", value: "value1"});
messages.push({key:"key2", value: "value2"});
 
const kafka = new Kafka({
  clientId: 'encounter-producer',
  brokers: ['127.0.0.1:29092']
})

const admin = kafka.admin();
 
const eventproducer = kafka.producer()

const run = async () => { 
  const topics = [{
    topic: 'patient',
    numPartitions: 1,
    replicationFactor: 1,
    replicaAssignment: [],
    configEntries : [{name: 'cleanup.policy', value: 'compact'}]
  }]

  await eventproducer.connect()
  //await admin.createTopics({validateOnly: false,waitForLeaders: false,topics: topics});
  await eventproducer.send({
    topic: 'patient',
    messages: messages,
  })
  await eventproducer.disconnect();
  await admin.disconnect();
}
 
run().catch(console.error)