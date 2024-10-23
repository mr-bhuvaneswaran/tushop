const fs = require('fs');

function previousNonOverlappingJob(jobs, index) {
    for (let i = index - 1; i >= 0; i--) {
        if (jobs[i].endTime <= jobs[index].startTime) {
            return i;
        }
    }
    return -1;
}

function scheduleJobs(jobs) {
    const totalJobs = jobs.length;

    jobs.sort((a, b) => a.endTime - b.endTime); // Bubble sort can also be used to sort by end time of jobs

    const maximumProfitAtEachStep = new Array(totalJobs).fill({ profit: 0, jobCount: 0 });
    maximumProfitAtEachStep[0] = { profit: jobs[0].profit, jobCount: 1 };
    let totalProfit = jobs[0].profit;

    for (let i = 1; i < totalJobs; i++) {
        totalProfit += jobs[i].profit;
        const currentStepProfit = { profit: jobs[i].profit, jobCount: 1};

        const previousJobIndex = previousNonOverlappingJob(jobs, i);
        if (previousJobIndex !== -1) {
            currentStepProfit.profit += maximumProfitAtEachStep[previousJobIndex].profit;
            currentStepProfit.jobCount += maximumProfitAtEachStep[previousJobIndex].jobCount;
        }

        const isCurrentJobIncluded = maximumProfitAtEachStep[i - 1].profit < currentStepProfit.profit;
        const previousStepProfit = maximumProfitAtEachStep[i - 1];
        maximumProfitAtEachStep[i] =  isCurrentJobIncluded ? currentStepProfit : previousStepProfit;

    }

    const totalJobsTaken = maximumProfitAtEachStep[totalJobs - 1].jobCount;
    const totalJobEarnings = maximumProfitAtEachStep[totalJobs - 1].profit;

    const remainingJobs = totalJobs - totalJobsTaken;
    const remainingEarnings = totalProfit - totalJobEarnings;

    return [remainingJobs, remainingEarnings];
}

function processJobInputFile(inputFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8').split('\n');

    const jobs = [];
    for (let i = 1; i < data.length; i += 3) {
        jobs.push({ startTime: parseInt(data[i]), endTime: parseInt(data[i + 1]), profit: parseInt(data[i + 2]) });    
    }

    const remainingJobsAndEarnings = scheduleJobs(jobs);
    console.log(`Remaining Jobs And Earnings`, remainingJobsAndEarnings);

    fs.writeFileSync('output.txt', JSON.stringify(remainingJobsAndEarnings));
    process.exit(0);
}


const inputFilePath = process.argv[2];
if (!inputFilePath || !fs.existsSync(inputFilePath)) {
    console.error('Invalid input file path.');
    process.exit(1);
}

processJobInputFile(inputFilePath);
