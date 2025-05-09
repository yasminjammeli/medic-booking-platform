const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'appointment-service',
  brokers: ['kafka:9092'], // pour Docker, sinon localhost:9092
});

const producer = kafka.producer();

const produceAppointmentEvent = async (payload) => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'appointment-created',
      messages: [{ value: JSON.stringify(payload.data) }],
    });
    console.log('✅ Event sent to Kafka:', payload.data);
    await producer.disconnect();
  } catch (error) {
    console.error('❌ Failed to send event:', error.message);
  }
};

module.exports = { produceAppointmentEvent };
