const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    role: String
    specialty: String
  }

  type Appointment {
    _id: ID
    patientId: String
    doctorId: String
    date: String
    description: String
    status: String
    patient: User
    doctor: User
  }

  input AppointmentUpdateInput {
    date: String
    description: String
    status: String
  }

  type Query {
    appointments(patientId: String, doctorId: String): [Appointment]
    users: [User]
  }

  type Mutation {
    createAppointment(
      patientId: String!
      doctorId: String!
      date: String!
      description: String
    ): Appointment

    cancelAppointment(id: ID!): Appointment

    updateAppointment(id: ID!, input: AppointmentUpdateInput!): Appointment
  }
`;
