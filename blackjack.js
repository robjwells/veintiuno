var BJ = (function () {
    "use strict";
    var player, dealer, // placeholders used later
        pTally = 0,     // player wins
        dTally = 0,     // dealer wins

        // Game routines - placeholders. (Assigned later)
        start,
        cleanUp,
        play,
        bjCheck,
        stand,
        dealerRoutine,
        endGame,
        again,


        // Convenience functions

        // Add a class to an element
        addClass = function (el, cl) {
            var curClasses = el.getAttribute('class');
            if (curClasses !== null) { // check if 'class' is set
                el.setAttribute('class', (curClasses + ' ' + cl));
            } else { // when el has no class
                el.setAttribute('class', cl);
            }
        },

        // Remove a class from an element
        removeClass = function (el, cl) {
            var newClasses = '',
                elClasses = el.getAttribute('class'),
                classArray = elClasses.split(' '),
                caLength = classArray.length,
                clIndex = classArray.indexOf(cl),
//DEV                htmlId = el.getAttribute('id'),
                i;

//DEV            // Check for failure conditions
//             if (elClasses === null) { // 'class' is not set
//                 return console.log('#' + htmlId + ' has no class set');
//             }
//             if (clIndex === -1) { // -1 if x is not found
//                 return console.log('#' + htmlId + ' does not have .' + cl);
//             }

            classArray.splice(clIndex, 1); // Remove the unwanted class

            if (caLength === 0) {
                el.removeAttribute('class'); // Remove class attr if empty
            } else {
                for (i = 0; i < classArray.length; i += 1) {
                    newClasses += classArray[i];
                    if (i !== classArray.length - 1) {
                        newClasses += ' ';
                    }
                }
                el.setAttribute('class', newClasses);
            }
        },

        // document.getElementById shortcut
        getId = function (el) {
            return document.getElementById(el);
        },


        // Basic game resources

        // Returns a new, full deck of cards
        newDeck = function () {
            return [['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'],
                    ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'],
                    ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'],
                    ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King']];
        },

        // Returns a fresh set of four suits
        newSuits = function () {
            return ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        },

        // Initialise the suits and deck
        suits = newSuits(),
        deck = newDeck(),

        // Initialise the game-since-shuffle counter
        shuffleInterval = 0,

        // Check the deck and suits and replenish if needed
        shuffle = function () {
            // This var reflects the total number of cards left in the deck
            var totalDeck = Array.prototype.concat(deck[0], deck[1], deck[2], deck[3]);

            if (shuffleInterval === 6 || totalDeck.length < 20) {
                deck = newDeck();
                suits = newSuits();
                shuffleInterval = 0;
            } else {
                shuffleInterval += 1;
            }
        },


        // Interface functions

        // Show and hide the start and results overlays
        toggleOverlay = function (el) {
            var classes = el.getAttribute('class').split(' '),
                bD = 'bounceInDown',
                bU = 'bounceOutUp';

            // overlay has .bounceInDown
            if (classes.indexOf(bD) !== -1) { removeClass(el, bD); }
            // overlay has .bounceOutUp
            if (classes.indexOf(bU) !== -1) { removeClass(el, bU); }

            if (classes.indexOf('hide') !== -1) { // overlay is hidden (.hide)
                addClass(el, bD);               // Bounce into view
                removeClass(el, 'hide');        // Unhide overlay
            } else {
                addClass(el, bU);               // Bounce out of view
                setTimeout(addClass, 500, el, 'hide');
                // timer used to prevent element disappearing instantly
            }
        },

        // Show a small, temporary status window
        pop = function (statusText) {
            var statusPop = getId('status-pop'),
                statusMsg = getId('status-text');

            statusMsg.innerHTML = statusText;

            removeClass(statusPop, 'hide');                     //Reveal
            setTimeout(addClass, 1250, statusPop, 'hide');      //Hide again
        },

        // Draw a card in the specified player's area
        drawCard = function (player, card, hidden) {
            // Starts with convenience create function
            var cr = function (x) { return document.createElement(x); },
                area = getId(player),
                currentCards = area.getElementsByClassName('card'),
                cardDiv = cr('div'),
                frontDiv = cr('div'),
                backDiv = cr('div'),
                tlNum = cr('div'),
                brNum = cr('div'),
                number = card.getNumber(),
                newClasses = 'wayoff card ' + card.getSuit().toLowerCase();

            addClass(frontDiv, 'front');
            addClass(backDiv, 'back');
            addClass(tlNum, 'num tl');
            addClass(brNum, 'num br');

            if (hidden !== 'hidden') {
                if (typeof number !== 'string') {
                    tlNum.innerHTML = brNum.innerHTML = number;
                } else { // For f/aces, only the first char is used
                    tlNum.innerHTML = brNum.innerHTML = number[0];
                }
            } else { // For hidden cards, this prevents peeking ;)
                tlNum.innerHTML = brNum.innerHTML = 'X';
            }

            // Tilt odd cards left, even cards right
            if (currentCards.length % 2 === 0) {
                newClasses += ' tilt-left';
            } else {
                newClasses += ' tilt-right';
            }

            if (hidden === 'hidden') {
                cardDiv.setAttribute('id', 'hole');
                newClasses += ' flipped';
            }

            addClass(cardDiv, newClasses);
            // Assemble the card
            frontDiv.appendChild(tlNum);
            frontDiv.appendChild(brNum);
            cardDiv.appendChild(frontDiv);
            cardDiv.appendChild(backDiv);
            area.appendChild(cardDiv);
            // Timer used to ensure CSS transition applies
            setTimeout(removeClass, 20, cardDiv, 'wayoff');
        },

        // Draw the first four cards
        initialDraw = function () {
            drawCard('player', player.getCards()[0], 'visible');
            drawCard('player', player.getCards()[1], 'visible');
            drawCard('dealer', dealer.getCards()[0], 'visible');
            drawCard('dealer', dealer.getCards()[1], 'hidden');
        },

        // Reveal the hole card
        flip = function () {
            var realHole = dealer.getCards()[1],
                number = realHole.getNumber(),
                pageHole = getId('hole'),
                numDivs = pageHole.getElementsByClassName('num');

            if (typeof number !== 'string') {
                numDivs[0].innerHTML = numDivs[1].innerHTML = number;
            } else {
                numDivs[0].innerHTML = numDivs[1].innerHTML = number[0];
            }

            removeClass(pageHole, 'flipped');
        },

        // Display and dismiss the about box
        about = function () {
            var aboutBox = getId('about'),
                aboutDismiss = getId('about-dismiss'),
                aboutButton = getId('about-button'),
                enough = function () {
                    toggleOverlay(aboutBox);
                    aboutDismiss.removeEventListener('click', enough, false);
                    aboutButton.removeEventListener('click', enough, false);
                    aboutButton.addEventListener('click', about, false);
                };
            toggleOverlay(aboutBox);
            aboutButton.removeEventListener('click', about, false);
            aboutButton.addEventListener('click', enough, false);
            aboutDismiss.addEventListener('click', enough, false);
        },


        // Card and hand logic

        // Card constructor
        // Holds suit, number and value
        Card = function (s, n) {
            var suit = s,
                number = n;

            this.getSuit = function () { return suit; };
            this.getNumber = function () { return number; };
            this.getValue = function () {
                if (typeof number === 'string') {
                    if (number === 'Ace') { return 11; }
                    return 10; // Other face cards. (Ace has already returned.)
                }
                return number;
            };
        },

        // Select and remove a card from the deck
        pull = function (s, n) {
            var x = deck[s][n];
            deck[s].splice(n, 1);
            return x;
        },

        // Deal a random card
        deal = function () {
            // s & n are raw numbers, suit & number are 'real'
            var s, n, suit, number, i;

            // Loop to discard empty suits before dealing
            for (i = 0; i < suits.length; i += 1) {
                if (deck[i].length === 0) {
                    suits.splice(i, 1);
                    deck.splice(i, 1);
                }
            }

            // Use random numbers to pick from what's left
            s = Math.floor(Math.random() * suits.length);
            n = Math.floor(Math.random() * deck[s].length);
            suit = suits[s];
            number = pull(s, n);
            return (new Card(suit, number));
        },

        // Hand constructor
        // Holds players' cards and functions to add more and retrieve data
        Hand = function () {
            // Create and initiate a cards array with two card objects
            var cards = [];
            cards.push(deal());
            cards.push(deal());

            // Hand off the card array
            this.getCards = function () { return cards; };

            // Add a card
            // 'who' parameter used to reserve bust-checking for user only
            this.hit = function (who) {
                var newCard;
                cards.push(deal());
                newCard = cards[(cards.length - 1)];

                // For the player, 'who' is originally a MouseEvent object
                if (who.type === 'click') { who = 'player'; }
                drawCard(who, newCard, 'visible');

                // If player is bust display message and end turn
                if (who === 'player' && player.getScore() > 21) {
                    setTimeout(pop, 1250, 'You\u2019re bust');
                    return setTimeout(stand, 2500);
                }
            };

            // Return a description of the hand's cards
            // It looks complicated, but it's just English-language grammar
            this.printCards = function () {
                var firstCard = cards[0].getNumber(),
                    cs = '',
                    x;

                // Change the article if first card begins with a vowel
                if (firstCard === 8 || firstCard === 'Ace') {
                    cs += 'an ';
                } else {
                    cs += 'a ';
                }

                for (x = 0; x < cards.length; x += 1) {
                    // Add the card details to the string
                    cs += (cards[x].getNumber() + ' of ' + cards[x].getSuit());

                    // If not the last card
                    if (x !== cards.length - 1) {
                        // If the penultimate card. (Sorry Oxford comma nerds.)
                        if (x === cards.length - 2) {
                            // If the card begins with a vowel
                            if (cards[x + 1].getNumber() === 8 ||
                                    cards[x + 1].getNumber() === 'Ace') {
                                cs += ' and an ';
                            } else {
                                cs += ' and a ';
                            }
                        } else {
                            // Add a comma space separator
                            cs += ', ';
                        }
                    } else {
                        // Finish with a period
                        cs += '.';
                    }
                }
                return cs;
            };

            // Calculate and return the hand's score
            this.getScore = function () {
                var x,
                    numCards = cards.length,
                    aces = 0,
                    score = 0,

                    // Turns high aces into low aces if bust
                    acesCheck = function check() {
                        if (score <= 21 || aces <= 0) {
                            return;
                        }
                        score -= 10;
                        aces -= 1;
                        check();
                    };

                // Check hand for aces
                for (x = 0; x < numCards; x += 1) {
                    if (cards[x].getNumber() === 'Ace') { aces += 1; }
                    score += cards[x].getValue();
                }

                acesCheck();
                return score;
            };
        };
        // End of variable declarations


    // Game routines - function assignment

    // Start the game
    start = function () {
        var startBox = getId('start');

        // Remove the start dialog
        startBox.removeEventListener('click', start, false);
        toggleOverlay(startBox);

/*
        // Show the card areas
        removeClass(getId('dealer'), 'hide');
        removeClass(getId('player'), 'hide');
*/

        setTimeout(cleanUp, 250);
    };

    // Prepares play area for a new game
    cleanUp = function () {
        var dArea = getId('dealer'),
            pArea = getId('player'),
            dCards = Array.prototype.slice.call(dArea.getElementsByClassName('card')),
            pCards = Array.prototype.slice.call(pArea.getElementsByClassName('card')),
            cards = dCards.concat(pCards),
            i;

        // Sweep cards off to the left
        for (i = 0; i < cards.length; i += 1) {
            addClass(cards[i], 'wayoff');
        }

        // Empty the play area and begin a new game
        setTimeout(function () {
            dArea.innerHTML = '';
            pArea.innerHTML = '';
            play();
        }, 1000); // Timed so cards are deleted after leaving the viewport
    };

    // Reset old hands, deal new hands, then draw them
    play = function () {
        // Empty the player & dealer hands
        player = null;
        dealer = null;

        // Replenish the deck if needed
        shuffle();

        // Deal two new hands and draw them
        player = new Hand();
        dealer = new Hand();
        initialDraw();

        // Enable hit & stand controls
        getId('hit').addEventListener('click', player.hit, false);
        getId('stand').addEventListener('click', stand, false);

        // Check for blackjack
        bjCheck();
    };

    // End the game immediately if either play was dealt blackjack
    bjCheck = function () {
        var hitButton = getId('hit'),
            standButton = getId('stand');

        // If player or dealer has blackjack
        if (player.getScore() === 21 || dealer.getScore() === 21) {

            if (dealer.getScore() === 21) {
                // Reveal the hole card if dealer has blackjack
                setTimeout(flip, 1000);
            }

            // Hide the player's controls
/*             addClass(hitButton, 'hide'); */
/*             addClass(standButton, 'hide'); */
            hitButton.removeEventListener('click', player.hit, false);
            standButton.removeEventListener('click', stand, false);

            // Status message: blackjack
            pop('Blackjack!');

            // Call endGame noting blackjack
            setTimeout(endGame, 2000, 'blackjack');
        }
    };

    // End the player's turn
    stand = function () {
        var hitButton = getId('hit'),
            standButton = getId('stand');

        // Hide the player's controls
        hitButton.removeEventListener('click', player.hit, false);
        standButton.removeEventListener('click', stand, false);
/*         addClass(hitButton, 'hide'); */
/*         addClass(standButton, 'hide'); */

        // Status message: dealer's turn, reveal hole card, call dealerRoutine
        setTimeout(pop, 1000, 'Dealer\u2019s turn');
        flip();
        return setTimeout(dealerRoutine, 3500);
    };


    dealerRoutine = function () {
        var score = dealer.getScore(),
            cards = dealer.getCards(),
            dAces,
            dealerLogic,
            aces = 0;

        // If card is an ace, record it
        dAces = function (card) {
            if (card.getNumber() === 'Ace') { aces += 1; }
        };

        // Decision-making function. Timers make it human-friendly
        dealerLogic = function logic() {
            var newCard;

            // Dealer has less than 17 or a soft 17
            if (score < 17 || (score === 17 && aces > 0)) {

                // Hit, check if card is an ace, increase score
                dealer.hit('dealer');
                newCard = cards[(cards.length - 1)];
                dAces(newCard);
                score += newCard.getValue();

                // Call decision function again
                return setTimeout(logic, 1500);
            }

            // Dealer is bust, but has a high ace
            if (score > 21 && aces >= 1) {

                //Convert high ace into low ace
                score -= 10;
                aces -= 1;

                // Call decision function again
                return setTimeout(logic, 1500);
            }

            // Ending conditions

            // If 17 and no high aces
            if ((score === 17 && aces < 1) ||
                    // If between 18 and 21
                    (score > 17 && score <= 21) ||
                            // Or if bust with no aces
                            (score > 21 && aces < 1)) {

                // Status message: finished, call endGame
                pop('Dealer is done');
                setTimeout(endGame, 1500);
            }
        };

        // Check if the first two cards are aces
        dAces(cards[0]);
        dAces(cards[1]);

        // Call recursive decision-making function
        dealerLogic();
    };

    // Decide the winner and display the results
    endGame = function (blackjack) {
        var p = player.getScore(),
            d = dealer.getScore(),
            pMsg = 'You have ' + p + ' with ' + player.printCards(),
            dMsg = 'The dealer has ' + d + ' with ' + dealer.printCards(),
            pSummary = getId('playercards'),
            dSummary = getId('dealercards'),
            resultsEl = getId('results'),
            winnerEl = getId('winner'),
            againButton = getId('again'),
            pCount = getId('p-count'),
            dCount = getId('d-count');

        againButton.addEventListener('click', again, false);

        // Special case for blackjack wins
        if (blackjack) {
            if (p === 21 && d === 21) {
                // If player and dealer both have blackjack
                winnerEl.innerHTML = 'You both have blackjack!';
                pMsg = 'What are the chances!? Well, about one in 565.';
                dMsg = 'If my maths is off, let me know @robjwells.';

            } else if (p === 21) {
                // If player has blackjack
                pMsg = 'You have blackjack with ' + player.printCards();
                winnerEl.innerHTML = 'You win!';
                // Update player wins counter
                pTally += 1;
                pCount.innerHTML = +pTally;

            } else if (d === 21) {
                // If dealer has blackjack
                dMsg = 'The dealer has blackjack with ' + dealer.printCards();
                winnerEl.innerHTML = 'The dealer won';
                //Update dealer wins counter
                dTally += 1;
                dCount.innerHTML = +dTally;
            }
            // Set the messages and diplay the results overlay
            pSummary.innerHTML = pMsg;
            dSummary.innerHTML = dMsg;
            return toggleOverlay(resultsEl);
        }

        // Regular winner checking

        // If player is not bust
        if (p <= 21) {
            // And dealer is not bust
            if (d <= 21) {

                // Player score greater than dealer's
                if (p > d) {
                    winnerEl.innerHTML = 'You win!';
                    pTally += 1;
                    pCount.innerHTML = +pTally;

                // Dealer score greater than dealer's
                } else if (d > p) {
                    winnerEl.innerHTML = 'The dealer won';
                    dTally += 1;
                    dCount.innerHTML = +dTally;

                } else {
                    winnerEl.innerHTML = 'You tied';
                }

            // Dealer is bust, player is not
            } else {
                winnerEl.innerHTML = 'You win!';
                dMsg += ' The dealer is bust.';
                pTally += 1;
                pCount.innerHTML = +pTally;
            }

        // Player is bust
        } else {
            // Dealer is also bust
            if (d > 21) {
                winnerEl.innerHTML = 'You\u2019re both bust';

            // Dealer is not bust
            } else {
                pMsg += ' You\u2019re bust.';
                winnerEl.innerHTML = 'The dealer won';
                dTally += 1;
                dCount.innerHTML = +dTally;
            }
        }

        // Set the messages and diplay the results overlay
        pSummary.innerHTML = pMsg;
        dSummary.innerHTML = dMsg;
        toggleOverlay(resultsEl);
    };

    // Dismiss the results overlay and deal a new hand
    again = function () {
        var resultsEl = getId('results'),
            hitButton = getId('hit'),
            standButton = getId('stand'),
            againButton = getId('again');

        // Disable play again button and hide overlay
        againButton.removeEventListener('click', again, false);
        toggleOverlay(resultsEl);

        // Show player controls
        removeClass(hitButton, 'hide');
        removeClass(standButton, 'hide');

        // Clear the old cards (starts the cycle again)
        cleanUp();
    };

    // Add initial event listeners
    window.addEventListener('load', function () {
        var playButton = getId('play'),
            aboutButton = getId('about-button');

        // Enable start button that begins the game
        playButton.addEventListener('click', start, false);

        // Enable about button chip
        aboutButton.addEventListener('click', about, false);

        // Make taps in iOS trigger button:active
        document.addEventListener('touchstart', function () {}, false);
        
    });


    // Create an object to store in BJ and return it
    return (function () {
        var myObj = Object.create(null),
            specialMessage = 'A little blackjack game made from HTML, CSS, ' +
                'SVG and JavaScript by @robjwells.\nThanks go to the lovely' +
                ' people at www.codecademy.com, who got me started.\nYou ' +
                'should check them out!\n\nI\'m planning on putting up a ' +
                'post-mortem on my blog in the next few days,\nso please ' +
                'visit www.robjwells.com if you\'re interested.';
        myObj.by = '@robjwells';
        myObj.invokeMe = function () { return specialMessage; };
        Object.freeze(myObj);
        return myObj;
    }());

}());