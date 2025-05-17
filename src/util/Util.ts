export async function measureExecutionTime(fn) {
  const start = performance.now();  // Record start time
  await fn();                             // Execute the passed function
  const end = performance.now();    // Record end time
  console.log(`Execution time: ${end - start} milliseconds`);
}

export async function emptySchem(){

}