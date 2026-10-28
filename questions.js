// Question bank. Each pool is ordered easiest to hardest and is used in order, never repeating.
// To add questions, append {"q": question, "a": answer, "w": one-line solution} to a pool.
const BANK = {
  "easy": [
    {
      "q": "What is 13 × 17?",
      "a": "221",
      "w": "13 × 17 = 13 × 20 − 13 × 3 = 260 − 39."
    },
    {
      "q": "What is 2¹²?",
      "a": "4096",
      "w": "2¹⁰ = 1024, × 4."
    },
    {
      "q": "What is 25 × 48?",
      "a": "1200",
      "w": "25 × 4 = 100, so 25 × 48 = 100 × 12."
    },
    {
      "q": "What is the expected value of one roll of a fair six-sided die?",
      "a": "3.5",
      "w": "(1+2+…+6)/6 = 21/6."
    },
    {
      "q": "What is the sum of the integers from 1 to 100?",
      "a": "5050",
      "w": "n(n+1)/2 = 100 × 101 / 2."
    },
    {
      "q": "A stock is quoted 9.80 bid, 10.20 offer. What is the mid price?",
      "a": "10.00",
      "w": "(9.80 + 10.20)/2."
    },
    {
      "q": "What is 7 × 8 × 9?",
      "a": "504",
      "w": "56 × 9."
    },
    {
      "q": "What is 6! ÷ 4!?",
      "a": "30",
      "w": "6 × 5."
    },
    {
      "q": "Three fair coins are flipped. What is the probability all three land heads?",
      "a": "1/8",
      "w": "(1/2)³."
    },
    {
      "q": "What is 7/8 as a decimal?",
      "a": "0.875",
      "w": "1 − 1/8 = 1 − 0.125."
    },
    {
      "q": "What is 3.6 × 2.5?",
      "a": "9",
      "w": "3.6 × 10 / 4."
    },
    {
      "q": "Ten people each shake hands with everyone else once. How many handshakes?",
      "a": "45",
      "w": "C(10,2) = 10 × 9 / 2."
    },
    {
      "q": "You buy at 40 and sell at 46. What is your percentage return?",
      "a": "15%",
      "w": "6 / 40."
    },
    {
      "q": "What is 19 × 21?",
      "a": "399",
      "w": "(20 − 1)(20 + 1) = 400 − 1."
    },
    {
      "q": "What is 11³?",
      "a": "1331",
      "w": "121 × 11."
    },
    {
      "q": "What is 17 × 23?",
      "a": "391",
      "w": "(20 − 3)(20 + 3) = 400 − 9."
    },
    {
      "q": "How many subsets does a 10-element set have?",
      "a": "1024",
      "w": "Each element is in or out: 2¹⁰."
    },
    {
      "q": "Two fair dice are rolled. What is the probability of rolling doubles?",
      "a": "1/6",
      "w": "6 doubles out of 36 outcomes."
    },
    {
      "q": "What is 1000 ÷ 16?",
      "a": "62.5",
      "w": "1000 / 2⁴ = 500, 250, 125, 62.5."
    },
    {
      "q": "What is 1/3 + 1/4 + 1/6?",
      "a": "3/4",
      "w": "4/12 + 3/12 + 2/12 = 9/12."
    },
    {
      "q": "What is 1/8 + 3/16?",
      "a": "5/16",
      "w": "2/16 + 3/16."
    },
    {
      "q": "You pay $2 to roll a die and receive the number rolled in dollars. What is your expected profit?",
      "a": "$1.50",
      "w": "3.5 − 2."
    },
    {
      "q": "What is 48 × 52?",
      "a": "2496",
      "w": "(50 − 2)(50 + 2) = 2500 − 4."
    },
    {
      "q": "What is 1.5% of 640?",
      "a": "9.6",
      "w": "1% is 6.4, 0.5% is 3.2."
    },
    {
      "q": "Two fair dice are rolled. What is the probability the sum is 10?",
      "a": "1/12",
      "w": "(4,6), (5,5), (6,4): 3 of 36."
    },
    {
      "q": "A fair coin is flipped 4 times. What is the probability of exactly 2 heads?",
      "a": "3/8",
      "w": "C(4,2)/16 = 6/16."
    },
    {
      "q": "One card is drawn from a standard deck. What is the probability it is a heart or a king?",
      "a": "4/13",
      "w": "13 hearts + 3 other kings = 16 of 52."
    },
    {
      "q": "What is 0.15²?",
      "a": "0.0225",
      "w": "15² = 225, four decimal places."
    },
    {
      "q": "What is 99²?",
      "a": "9801",
      "w": "(100 − 1)² = 10000 − 200 + 1."
    },
    {
      "q": "In how many orders can the letters of TRADE be arranged?",
      "a": "120",
      "w": "5! with no repeated letters."
    },
    {
      "q": "In how many distinct orders can the letters of LEVEL be arranged?",
      "a": "30",
      "w": "5! / (2! × 2!) for the repeated L and E."
    },
    {
      "q": "What is 37 × 27?",
      "a": "999",
      "w": "37 × 27 = 999 (37 × 3 = 111)."
    },
    {
      "q": "What is 75²?",
      "a": "5625",
      "w": "For numbers ending in 5: 7 × 8 = 56, then append 25."
    },
    {
      "q": "What is 65²?",
      "a": "4225",
      "w": "6 × 7 = 42, then append 25."
    },
    {
      "q": "What is 125 × 64?",
      "a": "8000",
      "w": "125 × 8 = 1000, × 8."
    },
    {
      "q": "What is 144 ÷ 0.12?",
      "a": "1200",
      "w": "144 / 12 × 100."
    },
    {
      "q": "What is the square root of 0.0081?",
      "a": "0.09",
      "w": "0.09² = 0.0081."
    },
    {
      "q": "How many ways can you choose 2 people from a group of 12?",
      "a": "66",
      "w": "12 × 11 / 2."
    },
    {
      "q": "What is 2²⁰?",
      "a": "1,048,576",
      "w": "1024²."
    },
    {
      "q": "A stock rises 20% and then falls 20%. What is its net percentage change?",
      "a": "−4%",
      "w": "1.2 × 0.8 = 0.96."
    }
  ],
  "medium": [
    {
      "q": "What is 1/3 + 1/9 + 1/27 + … (forever)?",
      "a": "1/2",
      "w": "Geometric series: (1/3) / (1 − 1/3)."
    },
    {
      "q": "Two fair dice are rolled. What is the probability the product is even?",
      "a": "3/4",
      "w": "Odd only if both are odd: 1 − (1/2)²."
    },
    {
      "q": "You flip a fair coin until it lands heads. What is the expected number of flips?",
      "a": "2",
      "w": "Geometric with p = 1/2: 1/p."
    },
    {
      "q": "What is the expected number of heads before the first tail when flipping a fair coin?",
      "a": "1",
      "w": "Total flips average 2, one of which is the tail."
    },
    {
      "q": "You roll a fair die until a 6 appears. What is the expected number of rolls?",
      "a": "6",
      "w": "Geometric with p = 1/6: 1/p."
    },
    {
      "q": "The pot has $100 and your opponent bets $50. What win probability makes calling break-even?",
      "a": "25%",
      "w": "You risk 50 to win 150; 50 / (50 + 150)."
    },
    {
      "q": "Two fair dice are rolled. What is the probability the sum is at least 10?",
      "a": "1/6",
      "w": "Sums 10, 11, 12 have 3 + 2 + 1 = 6 ways."
    },
    {
      "q": "A fair coin is flipped 5 times. What is the probability of at least one head?",
      "a": "31/32",
      "w": "1 − (1/2)⁵."
    },
    {
      "q": "Monty Hall: you pick one of 3 doors and the host opens a goat door. What is your win probability if you switch?",
      "a": "2/3",
      "w": "Switching wins whenever your first pick was a goat."
    },
    {
      "q": "Three fair dice are rolled. What is the probability all three show different numbers?",
      "a": "5/9",
      "w": "6 × 5 × 4 / 216 = 120/216."
    },
    {
      "q": "What is the angle, in degrees, between the hour and minute hands at 3:15?",
      "a": "7.5",
      "w": "Hour hand at 97.5°, minute hand at 90°."
    },
    {
      "q": "Two cards are drawn from a standard deck without replacement. What is the probability they are the same suit?",
      "a": "4/17",
      "w": "Second card matches the first's suit: 12/51."
    },
    {
      "q": "A bag has 3 red and 2 blue marbles. You draw 2 without replacement. What is the probability they are the same color?",
      "a": "2/5",
      "w": "(C(3,2) + C(2,2)) / C(5,2) = 4/10."
    },
    {
      "q": "An integer is chosen uniformly from 1 to 100. What is the probability it is divisible by 3 or 5?",
      "a": "47/100",
      "w": "33 + 20 − 6 (multiples of 15)."
    },
    {
      "q": "How many diagonals does a decagon have?",
      "a": "35",
      "w": "n(n − 3)/2 = 10 × 7 / 2."
    },
    {
      "q": "What is the expected number of fair coin flips needed to get 3 heads in total (not necessarily in a row)?",
      "a": "6",
      "w": "Each head takes 2 flips on average: 3 × 2."
    },
    {
      "q": "Two cards are drawn from a standard deck without replacement. What is the probability both are aces?",
      "a": "1/221",
      "w": "4/52 × 3/51."
    },
    {
      "q": "Five people line up at random. What is the probability two particular people stand next to each other?",
      "a": "2/5",
      "w": "2 × 4! / 5! = 48/120."
    },
    {
      "q": "What is the sum 1² + 2² + … + 10²?",
      "a": "385",
      "w": "n(n+1)(2n+1)/6 = 10 × 11 × 21 / 6."
    },
    {
      "q": "In how many ways can 5 identical balls be placed into 3 distinct boxes?",
      "a": "21",
      "w": "Stars and bars: C(7,2)."
    },
    {
      "q": "A committee of 3 with one designated chair is chosen from 10 people. How many ways?",
      "a": "360",
      "w": "C(10,3) × 3 = 120 × 3."
    },
    {
      "q": "How many integers from 1 to 1000 are perfect squares or perfect cubes?",
      "a": "38",
      "w": "31 squares + 10 cubes − 3 sixth powers (1, 64, 729)."
    },
    {
      "q": "How many shortest paths go from one corner of a 4×4 grid of squares to the opposite corner?",
      "a": "70",
      "w": "Choose 4 of 8 moves to be 'right': C(8,4)."
    },
    {
      "q": "A family has two children and at least one is a boy. What is the probability both are boys?",
      "a": "1/3",
      "w": "Equally likely cases BB, BG, GB."
    },
    {
      "q": "Stock is 100, a 100-strike call costs 6, rates are zero and there are no dividends. What should the 100-strike put cost?",
      "a": "6",
      "w": "Put-call parity: P = C − S + K."
    },
    {
      "q": "You buy a 100-strike call for 4 and a 100-strike put for 3. At what two stock prices do you break even at expiry?",
      "a": "93 and 107",
      "w": "Total premium 7, on either side of 100."
    },
    {
      "q": "A fair die is rolled twice. What is the expected number of distinct faces shown?",
      "a": "11/6",
      "w": "1 + P(second differs) = 1 + 5/6."
    },
    {
      "q": "A fair die is rolled three times. What is the probability the rolls are strictly increasing?",
      "a": "5/54",
      "w": "C(6,3) increasing triples / 216 = 20/216."
    },
    {
      "q": "Ten fair coins are flipped and the first is heads. What is the expected total number of heads?",
      "a": "5.5",
      "w": "1 + 9 × 1/2."
    },
    {
      "q": "What is the variance of the number of heads in 100 fair coin flips?",
      "a": "25",
      "w": "np(1 − p) = 100 × 1/4."
    },
    {
      "q": "You roll a die and may reroll once, keeping the second roll. With the best strategy, what is your expected payout?",
      "a": "17/4 (4.25)",
      "w": "Keep 4, 5, 6 (avg 5); otherwise reroll (3.5): 0.5 × 5 + 0.5 × 3.5."
    },
    {
      "q": "What is the probability of at least one 6 in four rolls of a fair die?",
      "a": "671/1296",
      "w": "1 − (5/6)⁴ = 1 − 625/1296."
    },
    {
      "q": "Two players alternate flipping a fair coin. The first to flip heads wins. What is the probability the first player wins?",
      "a": "2/3",
      "w": "p = 1/2 + (1/4)p, so p = 2/3."
    },
    {
      "q": "What is the expected value of the square of one fair die roll?",
      "a": "91/6",
      "w": "(1 + 4 + 9 + 16 + 25 + 36)/6."
    },
    {
      "q": "What is the variance of one fair die roll?",
      "a": "35/12",
      "w": "91/6 − 3.5² = 182/12 − 147/12."
    },
    {
      "q": "What are the last two digits of 7¹⁰⁰?",
      "a": "01",
      "w": "7⁴ = 2401 ends in 01, so every power of 7⁴ does."
    },
    {
      "q": "How many trailing zeros does 100! have?",
      "a": "24",
      "w": "⌊100/5⌋ + ⌊100/25⌋ = 20 + 4."
    },
    {
      "q": "A three-digit number (100 to 999) is chosen at random. What is the probability it is divisible by 7?",
      "a": "32/225",
      "w": "Multiples of 7 from 105 to 994: 128 of 900."
    },
    {
      "q": "Two fair dice are rolled and at least one shows a 6. What is the expected sum?",
      "a": "102/11",
      "w": "11 equally likely outcomes; their sums total 57 + 45 = 102."
    }
  ],
  "hard": [
    {
      "q": "A deck of 52 cards is shuffled. What is the expected number of cards that stay in their original position?",
      "a": "1",
      "w": "Linearity: 52 × 1/52."
    },
    {
      "q": "What is the last digit of 3²⁰²⁶?",
      "a": "9",
      "w": "Last digits cycle 3, 9, 7, 1; 2026 ≡ 2 (mod 4)."
    },
    {
      "q": "A bet wins with probability 60% and pays even money. What fraction of your bankroll does the Kelly criterion bet?",
      "a": "20%",
      "w": "f = p − q = 0.6 − 0.4."
    },
    {
      "q": "What is the expected number of fair coin flips until you see heads followed by tails (HT)?",
      "a": "4",
      "w": "Wait 2 for an H, then 2 more for the first T."
    },
    {
      "q": "What is the expected number of fair coin flips until you see two heads in a row (HH)?",
      "a": "6",
      "w": "E = (1/2)(1 + E) + (1/4)(2 + E) + (1/4)(2) gives E = 6."
    },
    {
      "q": "A disease affects 1% of people. A test is 90% accurate for both sick and healthy people. You test positive. What is the probability you have the disease?",
      "a": "1/12",
      "w": "0.009 / (0.009 + 0.099)."
    },
    {
      "q": "Four people's hats are shuffled and handed back at random. What is the probability nobody gets their own hat?",
      "a": "3/8",
      "w": "Derangements of 4: 9 of 24."
    },
    {
      "q": "Three ants sit at the corners of a triangle and each walks along a random edge. What is the probability no two ants collide?",
      "a": "1/4",
      "w": "Only all-clockwise or all-counterclockwise: 2 of 8."
    },
    {
      "q": "How many trailing zeros does 1000! have?",
      "a": "249",
      "w": "200 + 40 + 8 + 1."
    },
    {
      "q": "How many trailing zeros does 2026! have?",
      "a": "505",
      "w": "405 + 81 + 16 + 3."
    },
    {
      "q": "What is the expected number of runs (maximal blocks of identical faces) in 10 fair coin flips?",
      "a": "5.5",
      "w": "1 + 9 boundaries × 1/2 chance of a switch."
    },
    {
      "q": "What is the expected number of adjacent HH pairs in 10 fair coin flips?",
      "a": "9/4",
      "w": "9 adjacent pairs × 1/4."
    },
    {
      "q": "You have $3 and bet $1 on fair coin flips until you reach $10 or go broke. What is the probability you reach $10?",
      "a": "3/10",
      "w": "Fair game: P = start / target."
    },
    {
      "q": "Two fair dice are rolled. What is the expected value of the larger number?",
      "a": "161/36",
      "w": "Σ k × (2k − 1)/36 = 161/36."
    },
    {
      "q": "Two fair dice are rolled. What is the expected value of the smaller number?",
      "a": "91/36",
      "w": "max + min = sum, so 7 − 161/36."
    },
    {
      "q": "X and Y are independent and uniform on [0, 1]. What is E[max(X, Y)]?",
      "a": "2/3",
      "w": "For n uniforms, E[max] = n/(n + 1)."
    },
    {
      "q": "X and Y are independent and uniform on [0, 1]. What is E[|X − Y|]?",
      "a": "1/3",
      "w": "Difference of max (2/3) and min (1/3)."
    },
    {
      "q": "X and Y are independent and uniform on [0, 1]. What is P(X + Y < 1.5)?",
      "a": "7/8",
      "w": "Remove the corner triangle with area (0.5²)/2 = 1/8."
    },
    {
      "q": "You roll a die until a 6 appears. What is the expected sum of all rolls, including the 6?",
      "a": "21",
      "w": "5 expected non-6 rolls averaging 3, plus 6."
    },
    {
      "q": "What is the expected number of fair coin flips until you see the sequence HTH?",
      "a": "10",
      "w": "Overlap at H: 2 + 8 (or 2³ + 2¹)."
    },
    {
      "q": "What is the expected number of fair coin flips until you see three heads in a row?",
      "a": "14",
      "w": "2⁴ − 2."
    },
    {
      "q": "You roll a die up to three times and are paid the last roll. With the best strategy, what is your expected payout?",
      "a": "14/3",
      "w": "Keep 5 or 6 on roll 1, else play the 2-roll game worth 4.25: (1/3)(5.5) + (2/3)(4.25)."
    },
    {
      "q": "What is the expected number of die rolls needed to see all six faces?",
      "a": "14.7",
      "w": "6 × (1 + 1/2 + … + 1/6) = 6 × 49/20."
    },
    {
      "q": "Cards are dealt one at a time from a shuffled deck. What is the expected position of the first ace?",
      "a": "53/5 (10.6)",
      "w": "48 non-aces split into 5 gaps of expected size 48/5, plus 1."
    },
    {
      "q": "Three fair dice are rolled. What is the expected value of the largest?",
      "a": "119/24",
      "w": "Σ k × (k³ − (k − 1)³)/216 = 1071/216."
    },
    {
      "q": "You draw uniform [0, 1] numbers until their sum exceeds 1. What is the expected number of draws?",
      "a": "e (≈ 2.718)",
      "w": "P(more than n draws needed) = 1/n!, so E = Σ 1/n!."
    },
    {
      "q": "A stick is broken at two uniformly random points. What is the probability the three pieces form a triangle?",
      "a": "1/4",
      "w": "Every piece must be shorter than 1/2."
    },
    {
      "q": "Three points are chosen uniformly at random on a circle. What is the probability the triangle they form contains the center?",
      "a": "1/4",
      "w": "1 − 3 × (1/2)²: it fails when all three lie in a semicircle."
    }
  ]
};
