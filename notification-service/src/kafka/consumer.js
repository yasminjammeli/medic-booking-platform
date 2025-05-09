const { Kafka } = require('kafkajs');
const { sendAppointmentEmail } = require('../mailer/sendMail');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'notif-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("📥 New appointment event received:", data);

      // Ex: send to patient email (you can adapt this)
      await sendAppointmentEmail(
        data.email || 'test@example.com', // adapt as needed
        'Rendez-vous confirmé',
        `Votre rendez-vous avec Dr. ${data.doctorName} est confirmé pour le ${data.date}.`
      );
    }
  });
};

module.exports = run;
