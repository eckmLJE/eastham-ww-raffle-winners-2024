import * as fs from 'fs';
import * as readline from 'readline';

// Define the prize structure by generating an array of 70 prizes
const prizes = Array.from({ length: 80 }, (_, i) => `Prize${i + 1}`);

// Function to read CSV and return buyer ID and ticket quantities
export async function parseCSV(filePath: string): Promise<Map<string, number>> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const ticketMap = new Map<string, number>();

    for await (const line of rl) {
        const [buyerId, quantity] = line.split(',');
        ticketMap.set(buyerId, parseInt(quantity));
    }


    return ticketMap;
}

// Function to create a pool of tickets from the ticket map
export function createTicketPool(ticketMap: Map<string, number>): string[] {
    const ticketPool: string[] = [];

    ticketMap.forEach((quantity, buyerId) => {
        for (let i = 0; i < quantity; i++) {
            ticketPool.push(buyerId); // Add buyerId as many times as they have tickets
        }
    });

    return ticketPool;
}

// Function to shuffle the ticket pool (Fisher-Yates Shuffle)
export function shuffle(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to select winners
export function selectWinners(ticketPool: string[], prizes: string[]): Map<string, string> {
    const winners = new Map<string, string>();

    for (const prize of prizes) {
        const winningIndex = Math.floor(Math.random() * ticketPool.length);
        console.log(winningIndex)
        const winningTicket = ticketPool.splice(winningIndex, 1)[0]; // Remove the ticket from the pool
        winners.set(prize, winningTicket); // Associate prize with winner
    }

    return winners;
}

// Main function to run the raffle
export async function runRaffle(csvPath: string) {
    // Step 1: Parse the CSV to get buyer IDs and their ticket counts
    const ticketMap = await parseCSV(csvPath);

    // Step 2: Create a pool of tickets
    let ticketPool = createTicketPool(ticketMap);

    // Step 3: Shuffle the pool to ensure randomness
    ticketPool = shuffle(ticketPool);

    // Step 4: Select winners and associate prizes
    const winners = selectWinners(ticketPool, prizes);

    // Step 5: Output the winners
    winners.forEach((buyerId, prize) => {
        // console.log(`${prize},${buyerId}`);
    });
}

// Run the raffle
runRaffle('./src/ticket-buyer-list-by-quantity-and-id.csv').catch(console.error);