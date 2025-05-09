const axios = require('axios');
const APPOINTMENT_URL = process.env.APPOINTMENT_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const userClient = require('../grpc/userClient');

async function validateUser(userId, expectedRole) {
  return new Promise((resolve, reject) => {
    userClient.GetUserById({ userId }, (err, response) => {
      if (err) return reject(err);
      if (!response.exists || response.role !== expectedRole) {
        return reject(new Error(`L'utilisateur ${userId} n'est pas un ${expectedRole}.`));
      }
      resolve(true);
    });
  });
}

module.exports = {
  Query: {
    appointments: async (_, args) => {
      let url = `${APPOINTMENT_URL}/api/appointments`;

      if (args.patientId) {
        url += `?patientId=${args.patientId}`;
      } else if (args.doctorId) {
        url += `?doctorId=${args.doctorId}`;
      }

      const res = await axios.get(url);
      return res.data;
    },
    users: async () => {
      const res = await axios.get(`${USER_SERVICE_URL}/api/users`);
      return res.data;
    }
  },

  Appointment: {
    patient: async (parent) => {
      try {
        const res = await axios.get(`${USER_SERVICE_URL}/api/users/${parent.patientId}`);
        return res.data;
      } catch (err) {
        console.error('Error fetching patient:', err);
        return null;
      }
    },
    doctor: async (parent) => {
      try {
        const res = await axios.get(`${USER_SERVICE_URL}/api/users/${parent.doctorId}`);
        return res.data;
      } catch (err) {
        console.error('Error fetching doctor:', err);
        return null;
      }
    }
  },

  Mutation: {
    createAppointment: async (_, args) => {
      try {
        await validateUser(args.patientId, 'patient');
        await validateUser(args.doctorId, 'doctor');

        const res = await axios.post(`${APPOINTMENT_URL}/api/appointments`, args);
        return res.data;
      } catch (err) {
        console.error('Erreur lors de la création de rendez-vous:', err.message);
        throw new Error(err.message);
      }
    },

    cancelAppointment: async (_, { id }) => {
      try {
        const res = await axios.patch(`${APPOINTMENT_URL}/api/appointments/${id}/cancel`);
        return res.data;
      } catch (err) {
        console.error('Erreur annulation:', err.message);
        throw new Error(err.message);
      }
    },

    updateAppointment: async (_, { id, input }) => {
      try {
        const res = await axios.put(`${APPOINTMENT_URL}/api/appointments/${id}`, input);
        return res.data;
      } catch (err) {
        console.error('Erreur modification:', err.message);
        throw new Error(err.message);
      }
    }
  }
};
