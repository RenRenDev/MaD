let players = [];
let detective = null;
let currentPlayer = 0;
let roles = {};

function startGame() {
    for (let i = 1; i <= 20; i++) {
        const playerName = document.getElementById(`player${i}`).value.trim();
        if (playerName) {
            players.push(playerName);
        }
    }
    
    if (players.length < 4) {
        alert("Please enter names for at least 4 players.");
        return;
    }

    detective = players[Math.floor(Math.random() * players.length)];
    roles[detective] = 'Detective';
    players.forEach(player => {
        if (player !== detective) {
            roles[player] = 'Murderer';
        }
    });

    const playerBoards = document.getElementById('player-boards');
    playerBoards.innerHTML = '';
    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.id = `player${index + 1}-board`;
        playerDiv.innerText = player;
        playerBoards.appendChild(playerDiv);
    });

    document.getElementById('role-info').innerText = `You are playing as ${roles[players[currentPlayer]]}`;

    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    addMessage("The game has started. Try to identify the detective!");
    updateActions();
}

function updateActions() {
    if (roles[players[currentPlayer]] === 'Murderer') {
        document.getElementById('kill-button').style.display = 'block';
    } else {
        document.getElementById('kill-button').style.display = 'none';
    }
}

function rollDice() {
    return Math.floor(Math.random() * 20) + 1;
}

function roll3d20() {
    return rollDice() + rollDice() + rollDice();
}

function roll2d6() {
    return Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
}

function investigate() {
    let suspect = prompt("Who do you want to investigate?");
    if (!players.includes(suspect)) {
        alert("Invalid player. Please choose a valid player.");
        return;
    }

    let roll = roll2d6();
    if (roll <= 7) {
        addMessage(`A player investigated ${suspect} but found no clues (roll: ${roll}).`);
    } else {
        if (suspect === detective) {
            addMessage(`A player investigated ${suspect} and found the detective! (roll: ${roll})`);
            endGame("murderers");
        } else {
            addMessage(`A player investigated ${suspect} but found nothing useful (roll: ${roll}).`);
        }
    }
    nextTurn();
}

function accuse() {
    let accused = prompt("Who do you want to accuse?");
    if (!players.includes(accused)) {
        alert("Invalid player. Please choose a valid player.");
        return;
    }

    let roll = roll2d6();
    if (roll <= 7) {
        addMessage(`A player accused ${accused} wrongly. ${accused} is not the detective (roll: ${roll}).`);
    } else {
        if (accused === detective) {
            addMessage(`A player accused ${accused} correctly! ${accused} was the detective (roll: ${roll}).`);
            endGame("murderers");
        } else {
            addMessage(`A player accused ${accused} wrongly. ${accused} is not the detective (roll: ${roll}).`);
        }
    }
    nextTurn();
}

function passTurn() {
    addMessage(`A player passed their turn.`);
    nextTurn();
}

function kill() {
    let target = prompt("Who do you want to kill?");
    if (!players.includes(target)) {
        alert("Invalid player. Please choose a valid player.");
        return;
    }
    if (target === players[currentPlayer]) {
        alert("You cannot kill yourself.");
        return;
    }

    let roll = roll3d20();
    if (roll === 60) {
        addMessage(`A player successfully killed ${target}! (roll: ${roll})`);
        players = players.filter(player => player !== target);
        document.getElementById(`player${players.indexOf(target) + 1}-board`).innerText = '';
    } else if (roll >= 20 && roll < 60) {
        addMessage(`A player attempted to kill ${target} but alerted the detective! (roll: ${roll})`);
    } else {
        addMessage(`A player attempted to kill ${target} but missed. (roll: ${roll})`);
    }
    nextTurn();
}

function nextTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
    document.getElementById('role-info').innerText = `You are playing as ${roles[players[currentPlayer]]}`;
    updateActions();
}

function endGame(winner) {
    alert(`${winner} win!`);
    location.reload();
}

function addMessage(message) {
    let messageBox = document.getElementById('messages');
    let newMessage = document.createElement('p');
    newMessage.innerText = message;
    messageBox.appendChild(newMessage);
    messageBox.scrollTop = messageBox.scrollHeight;
}