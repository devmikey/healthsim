const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'admin-app',
  brokers: ['127.0.0.1:29092']
})

const admin = kafka.admin()

// remember to connect and disconnect when you are done

const run = async () => {

console.log(admin);
  await admin.connect()
  await admin.deleteTopics({topics: ['Condition','Patient','Observation','events']})
  await admin.disconnect()
}

run().catch(console.error)
