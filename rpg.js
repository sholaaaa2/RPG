let newPlayer = function (maxHp, maxMana, hp, atk, mana, armor, x, y) {
  this.maxHp = maxHp;
  this.maxMana = maxMana;
  this.hp = hp;
  this.atk = atk;
  this.mana = mana;
  this.armor = armor;
  this.x = x;
  this.y = y;
};

let newMob = function (name, hp, atk, minCord, maxCord, src) {
  this.name = name;
  this.hp = hp;
  this.atk = atk;
  this.minCord = minCord;
  this.maxCord = maxCord;
  this.src = src;
};

newMob.prototype.monsterShow = function () {
  $("#enemies span").text(`${this.name} НР:${this.hp}  ATK:${this.atk}`)
};

newMob.prototype.attack = function () {
  let mobDamage = this.atk - Math.ceil(player.armor*this.atk);
  if (mobDamage < 1) {
    mobDamage = 1;
  }
  player.changeHp(-mobDamage);
  stepEnd = true;
};

newPlayer.prototype.move = function (pxMove, direction, plus) {
  // Проверка не выходит ли за границы
  if(this[direction] == 0 && (+plus < 0)) {
    return
  }
  // Двигаем карту
  let pos = "background-position-"+direction;
  $("#map").css(pos,pxMove);

  // Перезаписываем координаты
  this[direction] += +plus;
  let select = "#player"+direction.toUpperCase();
  $(select).text(this[direction]);

  // Шанс появления моба
  if (Math.random()*100<40) {
    randomMob();
    showMessage(`Перед вами ${monster.name}`)
    this.startEndFight()
  } else {
    showMessage("Вы продолжаете свой путь")
  }
};

newPlayer.prototype.changeHp = function (change) {
  if ((this.hp + change) <= 0) {
    this.hp = 0;

    $("#health-bar").css("width",0);

    $("#curent-health").text(this.hp);

    showMessage("Вы погибли");

    setTimeout(()=>{
      $(".respawn").toggleClass("hiden-block");
    }, 1500)

  } else if ((this.hp + change) <= this.maxHp) {
    this.hp += change;

    $("#curent-health").text(this.hp);

    let changedWidth = `${(this.hp/this.maxHp)*100}%`;

    $("#health-bar").css("width",changedWidth);
  } else {
    this.hp = this.maxHp;
    $("#curent-health").text(this.hp);

    $("#health-bar").css("width","100%");
  }
};

newPlayer.prototype.changeMana = function (change) {
  if ((this.mana + change) <= 0) {
    this.mana = 0;

    $("#mana-bar").css("width",0);

    $("#curent-mana").text(this.mana);

  } else if ((this.mana + change) < this.maxMana) {
    this.mana += change;

    $("#curent-mana").text(this.mana);

    let changedWidth = `${(this.mana/this.maxMana)*100}%`;

    $("#mana-bar").css("width",changedWidth);
  } else {
    this.mana = this.maxMana;
    $("#curent-mana").text(this.mana);
    $("#mana-bar").css("width","100%");
  }
};

newPlayer.prototype.startEndFight = function () {
  $("#actions").toggleClass("invisible-buttons");
  $("#move").toggleClass("hiden-block");
  $("#enemies").toggleClass("hiden-block");
  monster.monsterShow()
};

newPlayer.prototype.attack = function (attackCount) {
  if (stepEnd) {
    monster.hp -= attackCount;

    this.changeMana(1);

    if (monster.hp <=0) {
      // ЗАГЛУШКА НА КНОПКУ
      stepEnd = false;
      // СМЕРТЬ МОНСТРА
      monster.hp = 0;
      setTimeout(showMessage, 500, `Вы аттакуете ${monster.name}а`);
      setTimeout(showMessage, 1500, `Вы убили ${monster.name}а`);
      setTimeout(monster.monsterShow.bind(monster), 2000);
      setTimeout(this.startEndFight, 3500);
      setTimeout(()=>{
        stepEnd = true;
      }, 3500);
      setTimeout(showMessage, 3500, `Можете продолжить свой путь`);
    }

    else {
      // ЗАГЛУШКА НА КНОПКУ
      stepEnd = false;

      setTimeout(showMessage, 500, `Вы аттакуете ${monster.name}а`);

      setTimeout(monster.monsterShow.bind(monster), 800);

      setTimeout(showMessage, 2500, `${monster.name} нападает`);

      setTimeout(monster.attack.bind(monster), 3500);

      setTimeout(showMessage, 4000, `Ваш ход`);
    }
  }
};

newPlayer.prototype.block = function () {
  if (stepEnd) {
    // ЗАГЛУШКА НА КНОПКУ
    stepEnd = false;
    this.changeMana(3);

    let startArmor = this.armor;
    let blockPersent = 0.5 + startArmor;

    if (blockPersent >= 1) {
      blockPersent = 0.9
    };
    this.armor = blockPersent;
    setTimeout(showMessage, 500, `Вы ставите блок`);
    setTimeout(showMessage, 2000, `${monster.name} нападает`);
    setTimeout(monster.attack.bind(monster), 3000);
    setTimeout(()=>{
      this.armor = startArmor;
    }, 3100);
    setTimeout(showMessage, 3500, `Ваш ход`);
  }
};

newPlayer.prototype.respawn = function () {
  $("#map").css("background-position-x",spawn.x);
  $("#map").css("background-position-y",spawn.y);

  this.changeHp(this.maxHp);
  this.changeMana(this.maxMana);
  this.x = spawn.x;
  this.y = spawn.y;

  $("#playerX").text(this.x);
  $("#playerY").text(this.y);

  showMessage("Вы полностью востановили силы");
};


let player = new newPlayer(80, 20, 80, 5, 20, 0, 0, 0);

let monster;

let spawn = {
  x: 0,
  y: 0,
}

let stepEnd = true;

let mobArr = [
  new newMob("Орк", 15, 7, 6, 10, "./img/giant.gif"),
  new newMob("Кролик", 4, 1, 0, 5, "./img/giant.gif"),
  new newMob("Волк", 8, 4, 0, 5, "./img/giant.gif"),
  new newMob("Гоблин", 10, 5, 0, 5, "./img/giant.gif"),
]

function showMessage(string) {
  $("#dialog").text(string)
}

function randomMob() {
  let randNum = Math.floor(Math.random()*mobArr.length);
  let booleanCheck = checkMobSpawn(mobArr[randNum]);
  if (booleanCheck) {
    monster = Object.assign({},mobArr[randNum]);
    monster.__proto__ = mobArr[randNum];
  } else {
    randomMob()
  }
}

function checkMobSpawn(mob) {
  let maxCordPlayer = Math.max(player.x, player.y);
  let spawnBooleen = (maxCordPlayer <= mob.maxCord && maxCordPlayer >= mob.minCord);

  return spawnBooleen
}


// ПРИСВАИВАНИЕ СОБЫТИЯ----------------------------------------------------------------------------------------------------------


let movement = document.querySelector("#move");

movement.addEventListener("click", (event) => {
  if (event.target == movement) {
    return
  };
  let targ = event.target;
  player.move(targ.getAttribute("data-move"), targ.getAttribute("data-direction"),targ.getAttribute("data-direction-plus"));
});

let attackBtn = document.querySelector("#attack");
let blockBtn = document.querySelector("#block");
let spellsBtn = document.querySelectorAll(".spells-list span");


attackBtn.addEventListener("click", () => {
  player.attack(player.atk);
});

blockBtn.addEventListener("click", () => {
  player.block();
});

spellsBtn[0].addEventListener("click", () => {
  if (stepEnd) {
    if (player.mana >= 8) {
      player.changeMana(-9);
      player.attack((player.atk*2));
    } else {
      // ЗАГЛУШКА НА КНОПКУ
      stepEnd = false;
      setTimeout(showMessage, 500, `У вас недостаточно маны`);
      setTimeout(showMessage, 1500, `Ваш ход`);
      setTimeout(()=>{stepEnd = true}, 1500);
    }
  }
});

spellsBtn[1].addEventListener("click", () => {
  if (stepEnd) {
    if (player.mana >= 6) {
      // ЗАГЛУШКА НА КНОПКУ
      stepEnd = false;
      player.changeMana(-6);
      player.changeHp(15);
      setTimeout(showMessage, 500, `Вы вылечели 10 ед. HP`);

      setTimeout(showMessage, 2500, `${monster.name} нападает`);

      setTimeout(monster.attack.bind(monster), 3500);

      setTimeout(showMessage, 3500, `Ваш ход`);
    } else {
      // ЗАГЛУШКА НА КНОПКУ
      stepEnd = false;
      setTimeout(showMessage, 500, `У вас недостаточно маны`);
      setTimeout(showMessage, 1500, `Ваш ход`);
      setTimeout(()=>{stepEnd = true}, 1500);
    }
  }
});

spellsBtn[2].addEventListener("click", () => {
  if (stepEnd) {
    if (player.mana >= 15) {
      // ЗАГЛУШКА НА КНОПКУ
      stepEnd = false;
      player.changeMana(-15);

      let backDamage = Math.floor(monster.atk/2);

      if (backDamage < 1) {
        backDamage = 1;
      }

      monster.hp -= Math.floor(monster.atk/2);
      if (monster.hp<=0) {
        monster.hp=0;
      }

      setTimeout(showMessage, 500, `Вы покрываетесь каменной кожей`);

      setTimeout(showMessage, 2500, `${monster.name} нападает`);

      setTimeout(showMessage, 3500, `${monster.name} получает обратный урон`);

      setTimeout(monster.monsterShow.bind(monster), 3500);

      if (monster.hp == 0) {
        setTimeout(showMessage, 4000, `Вы убили ${monster.name}а`);
        setTimeout(()=>{stepEnd = true}, 6000);
        setTimeout(player.startEndFight, 6000);
        setTimeout(showMessage, 6000, `Можете продолжить свой путь`);
      } else {
        setTimeout(showMessage, 4500, `Ваш ход`);
        setTimeout(()=>{stepEnd = true}, 4500);
      }

    } else {
      // ЗАГЛУШКА НА КНОПКУ
      stepEnd = false;
      setTimeout(showMessage, 500, `У вас недостаточно маны`);
      setTimeout(showMessage, 1500, `Ваш ход`);
      setTimeout(()=>{stepEnd = true}, 1500);
    }
  }
});


let respawnBtn = document.querySelector(".respawn button");
respawnBtn.addEventListener("click", () => {
  player.respawn();
  $(".respawn").toggleClass("hiden-block");
  player.startEndFight();
})














$("#bag-button").click(()=>{
    $("#bag-button").toggleClass("active-bag");
    $("#player-bag").slideToggle(200)
})
