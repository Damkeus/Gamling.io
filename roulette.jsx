import React, { useState, useEffect } from 'react';
import'roulette.css';

const Roulette = () => {
  const [winningSpin, setWinningSpin] = useState(null);
  const [bankValue, setBankValue] = useState(1000);  // Valeur initiale de la banque
  const [currentBet, setCurrentBet] = useState(0);
  const [bet, setBet] = useState([]);
  const [numbersBet, setNumbersBet] = useState([]);

  // Les couleurs de la roulette
  const numRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  
  const spin = () => {
    const winningSpin = Math.floor(Math.random() * 36);
    setWinningSpin(winningSpin);
    spinWheel(winningSpin);

    setTimeout(() => {
      if (numbersBet.includes(winningSpin)) {
        let winValue = 0;
        let betTotal = 0;
        bet.forEach((b) => {
          const numArray = b.numbers.split(',').map(Number);
          if (numArray.includes(winningSpin)) {
            setBankValue((prevBankValue) => prevBankValue + (b.odds * b.amt) + b.amt);
            winValue += (b.odds * b.amt);
            betTotal += b.amt;
          }
        });
        win(winningSpin, winValue, betTotal);
      }

      setCurrentBet(0);
      document.getElementById('bankSpan').innerText = bankValue.toLocaleString("en-GB");
      document.getElementById('betSpan').innerText = currentBet.toLocaleString("en-GB");

      let pnClass = numRed.includes(winningSpin) ? 'pnRed' : (winningSpin === 0 ? 'pnGreen' : 'pnBlack');
      let pnContent = document.getElementById('pnContent');
      let pnSpan = document.createElement('span');
      pnSpan.setAttribute('class', pnClass);
      pnSpan.innerText = winningSpin;
      pnContent.append(pnSpan);
      pnContent.scrollLeft = pnContent.scrollWidth;

      setBet([]);
      setNumbersBet([]);
      removeChips();

      if (bankValue === 0 && currentBet === 0) {
        gameOver();
      }
    }, 10000);
  };

  const spinWheel = (winningSpin) => {
    const degree = (winningSpin * 9.73) + 362;
    document.getElementById('wheel').style.animation = 'wheelRotate 5s linear infinite';
    const ballTrack = document.getElementById('ballTrack');
    ballTrack.style.animation = 'ballRotate 1s linear infinite';

    setTimeout(() => {
      ballTrack.style.animation = 'ballStop 3s linear';
      ballTrack.style.setProperty('--degree', `-${degree}deg`);
    }, 2000);

    setTimeout(() => {
      ballTrack.style.transform = `rotate(-${degree}deg)`;
    }, 9000);
  };

  const win = (winningSpin, winValue, betTotal) => {
    if (winValue > 0) {
      let notification = document.createElement('div');
      notification.setAttribute('id', 'notification');
      let nSpan = document.createElement('div');
      nSpan.setAttribute('class', 'nSpan');
      let nsnumber = document.createElement('span');
      nsnumber.setAttribute('class', 'nsnumber');
      nsnumber.style.cssText = numRed.includes(winningSpin) ? 'color:red' : 'color:black';
      nsnumber.innerText = winningSpin;
      nSpan.append(nsnumber);
      let nsTxt = document.createElement('span');
      nsTxt.innerText = ' Win';
      nSpan.append(nsTxt);

      let nsWin = document.createElement('div');
      nsWin.setAttribute('class', 'nsWin');
      let nsWinBlock = document.createElement('div');
      nsWinBlock.setAttribute('class', 'nsWinBlock');
      nsWinBlock.innerText = `Bet: ${betTotal}`;
      nsWin.append(nsWinBlock);

      nsWinBlock = document.createElement('div');
      nsWinBlock.setAttribute('class', 'nsWinBlock');
      nsWinBlock.innerText = `Win: ${winValue}`;
      nsWin.append(nsWinBlock);

      nsWinBlock = document.createElement('div');
      nsWinBlock.setAttribute('class', 'nsWinBlock');
      nsWinBlock.innerText = `Payout: ${winValue + betTotal}`;
      nsWin.append(nsWinBlock);

      nSpan.append(nsWin);
      notification.append(nSpan);
      document.body.prepend(notification);

      setTimeout(() => {
        notification.style.cssText = 'opacity:0';
      }, 3000);

      setTimeout(() => {
        notification.remove();
      }, 4000);
    }
  };

  const removeChips = () => {
    let chips = document.getElementsByClassName('chip');
    if (chips.length > 0) {
      for (let i = 0; i < chips.length; i++) {
        chips[i].remove();
      }
    }
  };

  const gameOver = () => {
    alert("Game Over! You have no more money.");
  };

  return (
    <div id="roulette-container">
      <div id="bankBalance">
        Bank: <span id="bankSpan">{bankValue.toLocaleString("en-GB")}</span>
      </div>
      <div id="currentBet">
        Bet: <span id="betSpan">{currentBet.toLocaleString("en-GB")}</span>
      </div>
      <button className="spinBtn" onClick={spin}>Spin</button>
      <div id="wheel"></div>
      <div id="ballTrack"></div>
      <div id="pnContent"></div>
    </div>
  );
};

export default Roulette;
