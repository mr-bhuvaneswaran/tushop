install Node JS

```
sudo apt-get update
sudo apt-get install nodejs
```

Run the following command to run the application

```
node job_schedule.js input.txt
```

Add the input.txt file with the following format:

```
number_of_jobs
start_time (HHMM)
end_time (HHMM)
profit
```

Example:

```
1
0900
1000
1100
100
```

Output file will be generated with the following format:

```
[number_of_jobs_left, total_earnings_left]
```