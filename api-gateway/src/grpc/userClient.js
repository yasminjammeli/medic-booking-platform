const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../protos/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const client = new userProto.UserService(
  'user-service:50051',  // adresse du service user-service
  grpc.credentials.createInsecure()
);

module.exports = client;
