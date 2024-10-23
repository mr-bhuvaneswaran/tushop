const fs = require('fs');

function findOptimalGoodies(goodies, numberOfEmployees) {
    const totalGoodies = goodies.length;

    goodies.sort((a, b) => a.price - b.price);

    let minimumDifference = Infinity;
    let windowStartIndex = 0;

    for (let i = 0; i <= totalGoodies - numberOfEmployees; i++) {
        const currentDifference = goodies[i + numberOfEmployees - 1].price - goodies[i].price;
        if (currentDifference < minimumDifference) {
            minimumDifference = currentDifference;
            windowStartIndex = i;
        }
    }
    const chosenGoodies = goodies.slice(windowStartIndex, windowStartIndex + numberOfEmployees);
    return { chosenGoodies, minimumDifference };
}

function processGoodiesInputFile(inputFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8').split('\n');

    const numberOfEmployees = parseInt(data[0].split(':')[1].trim());

    const goodies = [];
    for (let i = 2; i < data.length; i++) {
        const [name, price] = data[i].split(':');
        goodies.push({ name: name.trim(), price: parseInt(price.trim()) });
    }

    const { chosenGoodies, minimumDifference } = findOptimalGoodies(goodies, numberOfEmployees);

    const output = [];
    output.push('The goodies selected for distribution are:');
    chosenGoodies.forEach(goodie => {
        output.push(`${goodie.name}: ${goodie.price}`);
    });
    output.push(`And the difference between the chosen goodie with highest price and the lowest price is ${minimumDifference}`);

    fs.writeFileSync('output.txt', output.join('\n'), 'utf8');
    console.log('chosenGoodies and minDifference', chosenGoodies, minimumDifference);
    process.exit(0);
}

const inputFilePath = process.argv[2];
if (!inputFilePath || !fs.existsSync(inputFilePath)) {
    console.error('Invalid input file path.');
    process.exit(1);
}

processGoodiesInputFile(inputFilePath);
