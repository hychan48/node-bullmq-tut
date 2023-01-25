/**
 * https://docs.bullmq.io/readme-1
 */
import { Worker } from 'bullmq';
import {queueName} from "./bullmq/bullMQConstants.mjs";
// const queueName = 'myJobName'

const worker = new Worker(queueName, async job => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log('job.data',job.data);
});
// worker.on('completed', job => {
//   console.log(`${job.id} has completed!`);
// });
//
// worker.on('failed', (job, err) => {
//   console.log(`${job.id} has failed with ${err.message}`);
// });
console.log('started');
