// @ts-nocheck
// eslint-disable @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// eslint-disable no-console, no-process-exit

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');
  try {
    const rawSql = await fs.promises.readFile(path.join(__dirname, './seed.sql'), {
      encoding: 'utf-8'
    });
    const sqlReducedToStatements = rawSql
      .split('\n')
      .filter((line) => !line.startsWith('--')) // remove comments-only lines
      .join('\n')
      .replace(/\r\n|\n|\r/g, ' ') // remove newlines
      .replace(/\s+/g, ' '); // excess white space
    const sqlStatements = splitStringByNotQuotedSemicolon(sqlReducedToStatements);

    for (const sql of sqlStatements) {
      await prisma.$executeRawUnsafe(sql);
      console.log(`Executed SQL: ${sql}`);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function splitStringByNotQuotedSemicolon(input) {
  const result = [];

  let currentSplitIndex = 0;
  let isInString = false;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "'") {
      isInString = !isInString;
    }
    if (input[i] === ';' && !isInString) {
      result.push(input.substring(currentSplitIndex, i + 1));
      currentSplitIndex = i + 2;
    }
  }

  return result;
}

void main();
