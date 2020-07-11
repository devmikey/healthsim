const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'admin-app',
  brokers: ['127.0.0.1:29092']
})

const admin = kafka.admin()

//listTopics function not yet in stable release so don't use

const run = async () => {
  await admin.connect()
  const topicsMetaData = await admin.fetchTopicMetadata();
  const existingTopicNames = topicsMetaData.topics.map(topic => topic.name);
  console.log(existingTopicNames)
  await admin.disconnect()
}

run().catch(console.error)
