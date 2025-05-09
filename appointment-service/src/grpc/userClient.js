const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const client = new userProto.UserService(
  process.env.USER_SERVICE_HOST || 'user-service:50051',
  grpc.credentials.createInsecure()
);

module.exports = client;
