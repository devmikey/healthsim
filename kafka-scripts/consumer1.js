const { Kafka } = require('kafkajs')
const fs = require('fs')

 
const kafka = new Kafka({
  clientId: 'patient-consumer1',
  brokers: ['127.0.0.1:29092']
})
 
const consumer = kafka.consumer({ groupId: 'patientmpi-group1' })

const run = async () => {


  await consumer.connect()
  await consumer.subscribe({ topic: 'Patient', fromBeginning: true })
 
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })

}
 
run().catch(console.error)