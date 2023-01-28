/**
yarn add mocha -D

package.json
  "imports": {
    "##/*": {
      "default": "./*"
    },
  },
  "type": "module",

  jsconfig.json
  {
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "##/*": ["./*"]
    }
  },
  "exclude": ["node_modules", ".nuxt", "dist"]
}



*/
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const assert = require('assert');
// const {describe,it} = require('mocha');
import assert from 'node:assert';
import { describe, it} from 'mocha';
/*
1.
yarn add mocha @babel/polyfill @babel/register @babel/preset-env babel-plugin-module-resolver --dev
yarn add @babel/core --dev
2.
-r @babel/register -r babel-plugin-module-resolver

3.
.babelrc
{

  "presets": ["@babel/preset-env"],
  "plugins": [
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "test": "./test",
        "underscore": "lodash",

        "~": "./"
      }
    }]
  ]

}
test specific timeout
this.timeout(500);//500ms
*/
/**
 * Should put this somewhere safe
 * todo filepath needs to be initialized as well...
 * @param fileName .json
 * @param data will automatically be changed
 */
import fs from 'node:fs';
import {Queue} from "bullmq";
import {connection, queueName} from "./bullMQConstants.mjs";
function writeToFile(fileName,data,space=2){
  const sFileName = /\./.test(fileName) ? fileName : fileName + '.json';
  const filePath = `bullmq/addJobsDemo/${sFileName}`
  fs.writeFileSync(filePath,
    typeof data === 'string' ? data :JSON.stringify(data,null,+space)
  );
}
describe('addJobsDemo.test.mjs', function(){
  let myQueue;
  before(async ()=>{
    myQueue = new Queue(queueName,{connection});
    // await myQueue.drain();

  });
  it('Basic Add Queue', async function(){
    //this.timeout(500);
    await myQueue.add('myJobName', { foo: 'basic add que' });
  });
  it('Scheduled Task', async function(){
    //this.timeout(500);
    await myQueue.add('init', { timestamp: Date.now() });
    await myQueue.add('delayed', { timestamp: Date.now() }, { delay: 5000 });
  });
  it('Loop Task', async function(){
    //this.timeout(500);
    await myQueue.add(
      'bird',
      { color: 'bird' },
      {
        repeat: {
          every: 1000,//1 seconds (1000 ms)
          limit: 10,
        },
      },
    );
  });
  /**
   * Crontab syntax
   */
  it('cron Task', async function() {
    await myQueue.obliterate();
    //this.timeout(500);
// Repeat job once every day at 3:15 (am)
    await myQueue.add('init', { timestamp: Date.now() });
    const job = await myQueue.add(
      'submarine',
      {color: 'yellow'},
      {
        repeat: {
          // pattern: '*/1 * * * *',//“At every minute" cant go faster than this
          pattern: '*/5 * * * * *',//bull mq added ms so it can
          limit: 2,//works but it's still in the repeated Queue for some reason as 'undefined'
        },
      },
    );

    // job.remove();
  });
  it('Check Task', async function() {

    const counts = await myQueue.getJobCounts(
      'wait','delayed','active','paused', 'completed', 'failed','repeat'
    );
    //acts as delayed...
    console.log(counts);
    // job.remove();
  });
  it('Check Task - repeat', async function() {

    const counts = await myQueue.getJobCounts(
      'wait','delayed','active','paused', 'completed', 'failed','repeat'
    );
    console.log('repeated count', counts.repeat);

    const repeated = await myQueue.getJobs(['repeat'], 0, 100, true);
    console.log({repeated});//undefine? why

    const delayed = await myQueue.getJobs(['delayed'], 0, 100, true);
    console.log({delayed});//not undefined. which is good?


    // job.remove();
  });

  it('queue repeatableJobs', async function() {

    await myQueue.drain();
    const repeatableJobs = await myQueue.getRepeatableJobs();

    console.log(repeatableJobs);//id is null though
    // await repeatableJobs[0].remove();//not a function.. doesnt work
  });
  it('queue obliterate', async function() {

    await myQueue.obliterate();
  });
  //rate limiting?
  //https://docs.bullmq.io/guide/rate-limiting
  after(async ()=>{
    await myQueue.close();
  })

});
