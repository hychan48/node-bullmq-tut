/**
 * https://docs.bullmq.io/readme-1
 *
 * https://www.reddit.com/r/googlecloud/comments/10k4v2t/why_suddenly_much_higher_costs_in_google_cloud/
 */
import { Worker } from 'bullmq';
import {queueName} from "../../bullmq/bullMQConstants.mjs";
import {launchFirefoxNT} from "./launchFirefox.nt.mjs";
// const queueName = 'myJobName'

const worker = new Worker(queueName, async job => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log('job.data',job.data);
  await launchFirefoxNT(false)

},{
  connection:{
    // host: "localhost",
    host: "DESKTOP-I5IO349.amd.com",
    port: 6379,
  }
  }
);
worker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});
console.log('started');
