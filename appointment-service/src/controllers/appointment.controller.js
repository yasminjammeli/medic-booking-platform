const Appointment = require('../models/appointment.model');
const { produceAppointmentEvent } = require('../kafka/producer');
const userClient = require('../grpc/userClient'); // ← ajouter ceci

async function validateUser(userId) {
  console.log(`Tentative de validation de l'utilisateur ${userId} via gRPC`);
  return new Promise((resolve, reject) => {
    userClient.GetUserById({ userId }, (err, response) => {
      if (err) {
        console.error('Erreur gRPC:', err);
        return reject(err);
      }
      console.log('Réponse gRPC:', response);
      resolve(response);
    });
  });
}

exports.create = async (req, res) => {
  const { patientId, doctorId, date, description } = req.body;

  try {
    // Vérifier patient et médecin via gRPC
    const patient = await validateUser(patientId);
    const doctor = await validateUser(doctorId);

    if (!patient.exists || patient.role !== 'patient') {
      return res.status(400).json({ error: 'Patient non valide' });
    }

    if (!doctor.exists || doctor.role !== 'doctor') {
      return res.status(400).json({ error: 'Médecin non valide' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      description
    });

    // Envoyer l'événement à Kafka
    await produceAppointmentEvent({
      type: 'appointment_created',
      data: {
    ...appointment._doc,
    patientEmail: patient.email,   // Add this line
    doctorName: doctor.name        // Optional: more personalized
  }
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error('Erreur création rendez-vous :', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;
    let filter = {};

    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;

    const appointments = await Appointment.find(filter);
    res.json(appointments);
  } catch (err) {
    console.error('Erreur lors de la récupération des rendez-vous :', err);
    res.status(500).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erreur annulation rendez-vous :', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Appointment.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erreur modification rendez-vous :', err);
    res.status(500).json({ error: err.message });
  }
};
