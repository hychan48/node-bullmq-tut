import { Queue } from 'bullmq';
import {connection,queueName} from "./bullMQConstants.mjs";

const myQueue = new Queue(queueName,{connection});

async function addJobs() {
  await myQueue.add('myJobName', { foo: 'bar' });
  await myQueue.add('myJobName', { qux: 'baz' });
}

await addJobs();
await myQueue.close();
// process.exit()
