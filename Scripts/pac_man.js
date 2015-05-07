/**
 * Created by Pavel on 06/05/2015.
 */


/**
 * Cell Definition:
 * Empty                    0000000000 => 0
 * Ball                     0000000001 => 1 (5 points)
 * MidBall                  0000100001 => 17 (15 points)
 * HighBall                 0001000001 => 33 (25 points)
 * PackMan                  0000000010 => 2
 * Monster                  0000000100 => 4
 * Monster + Ball           0000000101 => 5
 * BonusMonster             0000001000 => 8
 * BonusMonster+Ball        0000001001 => 9
 * Wall                     0000010000 => 16
 * TimeBonus                0010000000 => 128
 * LifeBonus                0100000000 => 256
 * ScoreBonus               1000000000 => 512
 */

var Cell = {
    Empty: 0,
    Ball: 1,
    MidBall: 17,
    HighBall:33,
    PackMan: 2,
    Monster: 4,
    Monster_Ball: 5,
    BonusMonster: 8,
    BonusMonster_Ball: 9,
    Wall: 16,
    TimeBonus: 128,
    LifeBonus: 256,
    ScoreBonus: 512
};

var wallCoordinates = [
    {x: 1, y:1},
    {x: 2, y:1},
    {x: 3, y:1},
    {x: 5, y:1},
    {x: 7, y:1},
    {x: 8, y:1},
    {x: 10, y:1},
    {x: 1, y:2},
    {x: 3, y:2},
    {x: 10, y:2},
    {x: 1, y:3},
    {x: 3, y:3},
    {x: 5, y:3},
    {x: 7, y:3},
    {x: 8, y:3},
    {x: 10, y:3},
    {x: 1, y:5},
    {x: 2, y:5},
    {x: 3, y:5},
    {x: 5, y:5},
    {x: 6, y:5},
    {x: 8, y:5},
    {x: 9, y:5},
    {x: 10,y:5},
    {x: 1, y:6},
    {x: 3, y:6},
    {x: 5, y:6},
    {x: 10,y:6},
    {x: 1, y:7},
    {x: 7, y:7},
    {x: 8, y:7},
    {x: 1, y:8},
    {x: 2, y:8},
    {x: 4, y:8},
    {x: 5, y:8},
    {x: 10, y:8},
    {x: 8, y:9},
    {x: 1, y:10},
    {x: 3, y:10},
    {x: 4, y:10},
    {x: 5, y:10},
    {x: 7, y:10},
    {x: 8, y:10},
    {x: 10, y:10}
]

var monsterCoordinates = [
    {x: 0, y:0},
    {x: 11,y:0},
    {x: 0, y:11}
];

var lblScore;
var lblTime;
var lblMaxTime;
var lblLifes;
var packMan;
var monsters;
var bonusMonster;
var board;
var score = 0;
var pac_color;
var start_time;
var time_elapsed;
var max_time;
var winScore;
var interval;
var timeInterval;
var bonus;
var lifes;
var balls;

var sColor, mColor, hColor;

function InitGame(ballsNum, monstersNum, maxTime,smallColor, midColor, highColor){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    lblScore = document.getElementById("lblScore");
    lblMaxTime = document.getElementById("lblMaxTime");
    lblTime = document.getElementById("lblTime");
    lblLifes = document.getElementById("lblLifes");

    sColor = smallColor;
    mColor = midColor;
    hColor = highColor;
    max_time = maxTime;
    balls = ballsNum;
    lblMaxTime.value = maxTime;
    timeInterval = 200;
    lifes = 3;
    bonus = false;

    board = new Array();
    for (var i = 0; i < 12; i++)
        board[i] = new Array();

    packMan=new Object();
    packMan.opend = true;

    monsters = new Array();


    bonusMonster = new Object();

    InitWalls();
    InitBoard(ballsNum, monstersNum);



    Draw();
}

function InitWalls(){
    for(i in wallCoordinates){
        var coordinate = wallCoordinates[i];
        board[coordinate.x][coordinate.y] = Cell.Wall;
    }
}

function InitMonsters(monstersNum) {
    for(var i=0; i < monstersNum; i++) {
        monsters[i] = new Object();
        monsters[i].i = monsterCoordinates[i].x;
        monsters[i].j = monsterCoordinates[i].y;
        board[monsters[i].i][monsters[i].j] = (board[monsters[i].i][monsters[i].j] | Cell.Monster);

    }
}

function InitBoard(ballsNum,monstersNum) {
    score = 0;
    pac_color = "yellow";
    var cnt = 144 - wallCoordinates.length;
    var food_remain = (ballsNum < cnt-1 ? (ballsNum > 0) ? ballsNum : 50 : cnt-1);
    var mid_ball = parseInt(0.3*food_remain);
    var high_ball = parseInt(0.1*food_remain);
    var small_ball = food_remain - high_ball - mid_ball;


    winScore = small_ball*5 + mid_ball*15 + high_ball*25;
    //alert('small: ' + small_ball + ' med: ' + mid_ball + 'high: ' + high_ball);
    //alert('WIN: ' + winScore + ' small: ' + small_ball + ' mid: ' + mid_ball + ' high: ' + high_ball);
    var monster_remain = monstersNum;
    start_time = new Date();

    function setBall(i, j) {
        var randomNum = Math.random();

        if (randomNum < high_ball / food_remain) {
            board[i][j] = Cell.HighBall;
            high_ball--;
            return;
        }else if (randomNum < mid_ball / food_remain) {
            board[i][j] = Cell.MidBall;
            mid_ball--;
            return;
        }else if (randomNum < small_ball / food_remain) {
            board[i][j] = Cell.Ball;
            small_ball--;
            return;
        }

        setBall(i, j);

    }

    InitPacMan();
    while(small_ball!=0 || mid_ball!=0 || high_ball!=0)
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 12; j++) {
                if (( board[i][j] & Cell.Wall) + ( board[i][j] & Cell.PackMan) + ( board[i][j] & Cell.Ball)== 0) {
                    var randomNum = Math.random();
                    if (randomNum <= 1.0 * food_remain / cnt) {
                        setBall(i, j);
                        food_remain--;
                    } else {
                        board[i][j] = Cell.Empty;
                    }
                    cnt--;
                }
            }
    }

    InitBonusMonster();

    InitMonsters(monstersNum);
    //if(small_ball!=0 || mid_ball!=0 || high_ball!=0)
    //alert('small: ' + small_ball + ' med: ' + mid_ball + 'high: ' + high_ball);

}
function InitPacMan(){
    while(!packMan.i)
        for (var i = 1; i < 11; i++) {
            for (var j = 1; j < 11; j++) {
                if(Math.random() < 0.00005 && (board[i][j] & Cell.Wall) == 0){
                    packMan.i=i;
                    packMan.j=j;

                    board[i][j] = Cell.PackMan;
                    break;
                }
            }
            if(packMan.i)
                break;
        }
}

function InitBonusMonster() {
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 12; j++) {
            if (Math.random() < 0.005 && ((board[i][j] & Cell.Wall) + (board[i][j] & Cell.Monster) + (board[i][j] & Cell.PackMan)) == 0) {
                bonusMonster.i = i;
                bonusMonster.j = j;
                board[i][j] = Cell.BonusMonster;
                return;
            }
        }
    }
    InitBonusMonster();
}

function Start() {
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);

    interval=setInterval(UpdatePosition, timeInterval);
}

function Pause(){
    window.clearInterval(interval);
}
function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) {
        return 2;
    }
    if (keysDown[37]) {
        return 3;
    }
    if (keysDown[39]) {
        return 4;
    }
}

function Draw() {
    canvas.width=canvas.width;
    lblScore.value = score;
    lblLifes.value = lifes;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 12; j++) {
            var center = new Object();
            center.x = i * 40 + 20;
            center.y = j * 40 + 20;

            context.beginPath();
            context.fillStyle = "rgba(100,100,100,0.9)";
            context.fillRect(center.x-20, center.y-20, 40, 40);

            if(board[i][j] == Cell.Wall) {
                DrawWall(center);
            }
            else
            {
                if((board[i][j] & Cell.TimeBonus) == Cell.TimeBonus)
                    DrawTimeBonus(center);
                if((board[i][j] & Cell.LifeBonus) == Cell.LifeBonus)
                    DrawLifeBonus(center);
                if((board[i][j] & Cell.ScoreBonus) == Cell.ScoreBonus)
                    DrawScoreBonus(center);
                if (board[i][j] == Cell.PackMan) {
                    DrawPacMan(center);
                } else if ((board[i][j] & Cell.Ball) == Cell.Ball) {
                    if((board[i][j] & Cell.MidBall) == Cell.MidBall)
                        DrawBall(center, Cell.MidBall);
                    else if((board[i][j] & Cell.HighBall) == Cell.HighBall)
                        DrawBall(center, Cell.HighBall);
                    else
                        DrawBall(center, Cell.Ball);
                }

                if((board[i][j] & Cell.Monster) == Cell.Monster)
                    DrawMonster(center);

                if((board[i][j] & Cell.BonusMonster) == Cell.BonusMonster)
                    DrawBonusMonster(center);


            }
        }
    }
}

var DrawPacMan = DrawPacManRight;

function DrawPacManRight(center){
    context.beginPath();
    if(packMan.opend)
        context.arc(center.x, center.y, 14, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
    else
        context.arc(center.x, center.y, 14, 0.0 * Math.PI, 2 * Math.PI); // half circle

    packMan.opend = !packMan.opend;

    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color
    context.fill();
    context.beginPath();
    context.arc(center.x + 5, center.y - 8, 2, 0, 2 * Math.PI); // half circle
    context.fillStyle = "black"; //color
    context.fill();
}

function DrawPacManLeft(center){
    context.beginPath();
    if(packMan.opend)
        context.arc(center.x, center.y, 14, 0.85 * Math.PI, 1.15 * Math.PI, true); // half circle
    else
        context.arc(center.x, center.y, 14, 0.0 * Math.PI, 2 * Math.PI); // half circle

    packMan.opend = !packMan.opend;

    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color
    context.fill();
    context.beginPath();
    context.arc(center.x - 5, center.y - 8, 2, 0, 2 * Math.PI); // half circle
    context.fillStyle = "black"; //color
    context.fill();
}

function DrawPacManUp(center){
    context.beginPath();
    if(packMan.opend)
        context.arc(center.x, center.y, 14, 1.35 * Math.PI, 1.65 * Math.PI, true); // half circle
    else
        context.arc(center.x, center.y, 14, 0.0 * Math.PI, 2 * Math.PI); // half circle

    packMan.opend = !packMan.opend;

    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color
    context.fill();
    context.beginPath();
    context.arc(center.x - 8, center.y - 1, 2, 0, 2 * Math.PI); // half circle
    context.fillStyle = "black"; //color
    context.fill();
}

function DrawPacManDown(center){
    context.beginPath();
    if(packMan.opend)
        context.arc(center.x, center.y, 14, 0.35 * Math.PI, 0.65 * Math.PI, true); // half circle
    else
        context.arc(center.x, center.y, 14, 0.0 * Math.PI, 2 * Math.PI); // half circle

    packMan.opend = !packMan.opend;

    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color
    context.fill();
    context.beginPath();
    context.arc(center.x - 8, center.y + 1, 2, 0, 2 * Math.PI);
    context.fillStyle = "black"; //color
    context.fill();
}

function DrawBall(center, type){
    context.beginPath();
    context.arc(center.x, center.y, 10, 0, 2* Math.PI);
    context.fillStyle = sColor; //color
    context.fill();

    //context.beginPath();
    //context.arc(center.x, center.y, 7, 0, 2* Math.PI);
    context.lineWidth = 1;
    if(type == Cell.MidBall) {
        //context.strokeStyle = "white"; //color
        //context.stroke();
        context.fillStyle = mColor; //color
        context.fill();

        context.beginPath();
        context.font = "normal 12px Arial"
        context.fillStyle = "white";
        context.fillText("15",center.x - 7, center.y + 4);
    }
    else if(type == Cell.HighBall) {
        //context.strokeStyle = " white"; //color
        //context.stroke();
        context.fillStyle = hColor; //color
        context.fill();

        context.beginPath();
        context.font = "normal 12px Arial"
        context.fillStyle = "white";
        context.fillText("25",center.x - 7, center.y + 4);
    }
    else{
        //context.strokeStyle = "white"; //color
        //context.stroke();

        context.beginPath();
        context.font = "normal 12px Arial"
        context.fillStyle = "white";
        context.fillText("5",center.x - 3, center.y + 4);
    }

}

function DrawMonster(center){
    context.beginPath();
    context.arc(center.x, center.y, 12, 0, 2.0 * Math.PI);
    context.lineTo(center.x, center.y);
    context.fillStyle = "red"; //color
    context.fill();
    context.beginPath();
    context.arc(center.x + 7, center.y - 6, 2, 0, 2 * Math.PI);
    context.arc(center.x - 5, center.y - 6, 2, 0, 2 * Math.PI);
    context.fillStyle = "black"; //color
    context.fill();
    context.beginPath();
    context.arc(center.x, center.y + 5, 6, 0, 2 * Math.PI);
    context.fillStyle = "black"; //color
    context.fill();
}

function DrawBonusMonster(center){
    context.beginPath();
    context.arc(center.x, center.y, 12, 0, 2.0 * Math.PI);
    context.lineTo(center.x, center.y);
    context.fillStyle = "blue"; //color
    context.fill();
    context.beginPath();
    context.fillStyle = "white";
    context.arc(center.x + 7, center.y - 6, 3, 0, 2 * Math.PI);
    context.arc(center.x - 5, center.y - 6, 3, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.arc(center.x + 7, center.y - 6, 2, 0, 2 * Math.PI);
    context.arc(center.x - 5, center.y - 6, 2, 0, 2 * Math.PI);
    context.fillStyle = "black"; //color
    context.fill();
    context.beginPath();
    context.arc(center.x, center.y + 1, 8, 0, 1 * Math.PI);
    context.strokeStyle = "black"; //color
    context.stroke();
}

function DrawWall(center){
    context.beginPath();
    context.fillStyle = "rgba(0,0,0,0.3)";
    context.fillRect(center.x - 20, center.y -20, 40, 40);
    context.clearRect(center.x - 18, center.y - 18, 36, 36);
    context.fillStyle = "rgba(0,0,0,0.1)";
    context.fillRect(center.x - 18, center.y -18, 36, 36);
}

function DrawTimeBonus(center){
    context.beginPath();
    context.moveTo(center.x - 10, center.y - 10);
    context.lineTo(center.x + 10, center.y - 10);
    context.moveTo(center.x + 10, center.y - 10);
    context.lineTo(center.x - 10, center.y + 10);
    context.moveTo(center.x - 10, center.y + 10);
    context.lineTo(center.x + 10, center.y + 10);
    context.moveTo(center.x + 10, center.y + 10);
    context.lineTo(center.x - 10, center.y - 10);
    context.lineWidth = 3;
    context.strokeStyle = 'yellow';
    context.stroke();
}

function DrawLifeBonus(center){
    context.beginPath();
    context.arc(center.x, center.y, 12, 0, 2.0 * Math.PI);
    context.fillStyle = "white"; //color
    context.fill();

    context.arc(center.x, center.y, 12, 0, 2.0 * Math.PI);
    context.lineWidth = 2;
    context.strokeStyle = "blue"; //color
    context.stroke();

    context.beginPath();
    context.font = "bold 14px Arial"
    context.fillStyle = "black";
    context.fillText("+1",center.x - 7, center.y + 4);
}

function DrawScoreBonus(center){
    context.beginPath();
    context.arc(center.x, center.y, 8, 0, 2.0 * Math.PI);
    context.strokeStyle = "darkgreen"; //color
    context.lineWidth = 4;
    context.stroke();

    context.beginPath();
    context.font = "bold 14px Arial"
    context.fillStyle = "black";
    context.fillText("8",center.x - 4, center.y + 5);
}

function MoveUp(shape, constraints) {
    constraints = !constraints? function(cell){return true;}: constraints;

    if (shape.j > 0 && board[shape.i][shape.j - 1] != Cell.Wall && constraints(board[shape.i][shape.j - 1])) {
        shape.j--;
        return true;
    }

    return false;
}
function MoveDown(shape, constraints) {
    constraints = !constraints? function(cell){return true;}: constraints;

    if (shape.j < 11 && board[shape.i][shape.j + 1] != Cell.Wall && constraints(board[shape.i][shape.j + 1])) {
        shape.j++;
        return true;
    }

    return false;
}
function MoveLeft(shape, constraints) {
    constraints = !constraints? function(cell){return true;}: constraints;

    if (shape.i > 0 && board[shape.i - 1][shape.j] != Cell.Wall && constraints(board[shape.i-1][shape.j])) {
        shape.i--;
        return true;
    }

    return false;
}
function MoveRight(shape, constraints) {
    constraints = !constraints? function(cell){return true;}: constraints;

    if (shape.i < 11 && board[shape.i + 1][shape.j] != Cell.Wall && constraints(board[shape.i+1][shape.j])) {
        shape.i++;
        return true;
    }

    return false;
}
function GoPackMan() {
    board[packMan.i][packMan.j]=0;

    var x = GetKeyPressed();
    if (x == 1) {
        MoveUp(packMan);
        DrawPacMan = DrawPacManUp;
    }
    else if (x == 2) {
        MoveDown(packMan);
        DrawPacMan = DrawPacManDown;
    }
    else if (x == 3) {
        MoveLeft(packMan);
        DrawPacMan = DrawPacManLeft;
    }
    else if (x == 4) {
        MoveRight(packMan);
        DrawPacMan = DrawPacManRight;
    }

    if((board[packMan.i][packMan.j] & Cell.TimeBonus) == Cell.TimeBonus ) {
        max_time += 5;
        lblMaxTime.value = max_time;
        play('eatBonus');
    }

    if((board[packMan.i][packMan.j] & Cell.LifeBonus) == Cell.LifeBonus ){
        lifes++;
        lblLifes.value = lifes;
        play('eatBonus');

    }

    if((board[packMan.i][packMan.j] & Cell.ScoreBonus) == Cell.ScoreBonus ){
        score += 8;
        play('eatBonus');

    }

    if((board[packMan.i][packMan.j]&Cell.Ball) == Cell.Ball)
    {

        if((board[packMan.i][packMan.j]&Cell.MidBall) == Cell.MidBall ) {
            score += 15;
            balls--;
        }
        else if((board[packMan.i][packMan.j]&Cell.HighBall) == Cell.HighBall) {
            score += 25;
            balls--;
        }
        else {
            score += 5;
            balls--;
        }


    }

    if((board[packMan.i][packMan.j]&Cell.BonusMonster) == Cell.BonusMonster){
        winScore += 50;
        score += 50;
        bonusMonster = null;
        pac_color = 'blue';
        play('eatBonus');
    }

    if((board[packMan.i][packMan.j] & Cell.Monster) == 0)
        board[packMan.i][packMan.j] = Cell.PackMan;
    else
        board[packMan.i][packMan.j] |= Cell.PackMan;
}

function GoMonsters(){
    function MonsterCellConstraints(cell){
        return ((cell & Cell.Monster) + (cell & Cell.BonusMonster)) == 0;
    }


    for (var i = 0; i < monsters.length; i++) {

        var moved = false;
        var monster = monsters[i];
        board[monster.i][monster.j] ^= Cell.Monster;

        var random = Math.random();
        if (random < 0.25)
            moved = MoveUp(monster, MonsterCellConstraints);
        else if (random < 0.5)
            moved = MoveDown(monster, MonsterCellConstraints);
        else if (random < 0.75)
            moved = MoveLeft(monster, MonsterCellConstraints);
        else
            moved = MoveRight(monster, MonsterCellConstraints);


        board[monster.i][monster.j] |= Cell.Monster;

    }
}

function GoBonusMonster(){
    function BonusMonsterConstraints(cell){
        return  ((cell & Cell.Monster) + (cell & Cell.PackMan)) == 0;
    }

    var moved = false;
    board[bonusMonster.i][bonusMonster.j] ^= Cell.BonusMonster;

    var random = Math.random();
    if (random < 0.25)
        moved = MoveUp(bonusMonster, BonusMonsterConstraints);
    else if (random < 0.5)
        moved = MoveDown(bonusMonster, BonusMonsterConstraints);
    else if (random < 0.75)
        moved = MoveLeft(bonusMonster, BonusMonsterConstraints);
    else
        moved = MoveRight(bonusMonster, BonusMonsterConstraints);

    board[bonusMonster.i][bonusMonster.j] |= Cell.BonusMonster;
}

function GoBonus(){
    var random = Math.random();

    if(!bonus && random < 0.1){
        bonus = true;
        random = Math.random();

        if(random < 0.05)
            GoLifeBonus();
        else
            GoTimeBonus();
    }

    random = Math.random();

    if(random < 0.05){
        GoScoreBonus();
    }
}




function GoTimeBonus(){
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 12; j++) {
            if(board[i][j] == Cell.Empty && Math.random() < 0.05){
                board[i][j] |= Cell.TimeBonus;
                setTimeout(function(){
                    ClearBonus(i, j);
                }, 5000);
                return;
            }
        }
    }
}

function GoLifeBonus(){
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 12; j++) {
            if(board[i][j] == Cell.Empty && Math.random() < 0.05){
                board[i][j] |= Cell.LifeBonus;
                setTimeout(function(){
                    ClearBonus(i, j);
                }, 5000);
                return;
            }
        }
    }
}

function GoScoreBonus(){
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 12; j++) {
            if(board[i][j] == Cell.Empty && Math.random() < 0.05){
                board[i][j] |= Cell.ScoreBonus;
                setTimeout(function(){
                    board[i][j] = Cell.Empty;
                }, 2000);
                return;
            }
        }
    }
}

function ClearBonus(i, j) {
    board[i][j] = Cell.Empty;
    setTimeout(function () {
        bonus = false;
    }, 3000);
}

function HasLost() {
    var ans = false;
    if((board[packMan.i][packMan.j] & Cell.Monster) != 0){
        lifes--;
        clearInterval(interval);
        if(lifes > 0)
            play('death');
        if(lifes > 0){
            for(var t =0 ; t<monsters.length; t++){
                board[monsters[t].i][monsters[t].j] ^= Cell.Monster;
                board[packMan.i][packMan.j] ^= Cell.PackMan;
                DrawPacMan = DrawPacManRight

                monsters[t].i = monsterCoordinates[t].x;
                monsters[t].j = monsterCoordinates[t].y;
                board[monsters[t].i][monsters[t].j] |= Cell.Monster;
            }
            InitPacMan();
            Draw();
            Start();
        }

        ans = true;
    }

    if (lifes == 0) {
        play('death');
        Loose('You Lost!');
        ans =  true;
    }

    if(time_elapsed >= max_time){
        if(score < 150) {
            Loose('You Can Do Better')
            ans = true;
        }
        else{
            balls =0;
            HasWon();
            ans = true;
        }

    }

    return ans;
}

function Loose(msg){
    Draw();
    alert(msg);
    clearInterval(interval);
}
function HasWon() {
    if (balls == 0) {
        window.clearInterval(interval);
        window.alert("Winner!");

        return true;
    }

    return false;
}

function UpdatePosition() {
    if(HasWon())
        return;

    GoPackMan();
    if(HasLost())
        return;

    GoMonsters();
    if(HasLost())
        return;

    if(bonusMonster)
        GoBonusMonster();

    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    if(HasLost())
        return;

    GoBonus();

    Draw();

    HasWon();
}

function play(sound){
    document.getElementById(sound).play();
}