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
      if (data.patientEmail) {
  await sendAppointmentEmail(
    data.patientEmail,
    'Rendez-vous confirmé',
    `Votre rendez-vous avec Dr. ${data.doctorName} est confirmé pour le ${data.date}.`
  );
} else {
  console.warn("❗ patientEmail missing in Kafka message:", data);
}

    }
  });
};

module.exports = run;
