const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const User = require('../models/user.model');

const PROTO_PATH = path.join(__dirname, '../../proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

function GetUserById(call, callback) {
  const userId = call.request.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return callback(null, { exists: false });
      }

      callback(null, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty || '',
        exists: true
      });
    })
    .catch(err => {
      console.error('gRPC Error:', err);
      callback(err);
    });
}

function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, { GetUserById });
  const PORT = '50051'; // Tu peux le rendre configurable via .env
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC Server running on port ${PORT}`);
    server.start();
  });
}

module.exports = startGrpcServer;
