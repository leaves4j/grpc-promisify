grpc-promisify
====
[gRPC](https://github.com/grpc/) is a high performance, open source, general-purpose RPC framework, `grpc-promisify` make gRPC client promisify in node.

## Installation

```sh
$ npm install grpc-promisify
```

##The Gist
```js
const PROTO_PATH = __dirname + '/hello.proto';
const promisify = require('grpc-promisify');
const grpc = require('grpc');
const hello_proto = grpc.load(PROTO_PATH).helloworld;

function main() {
  const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  const user = 'hello';
  
  promisify(client);
  client.sayHello({name: user})
  .then(res => console.log(res.message))
  .catch(err => console.error(err));
}

main();
```

## License

The MIT license.

