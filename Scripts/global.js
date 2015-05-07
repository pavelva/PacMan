/**
 * Created by Pavel on 03/05/2015.
 *
 */

var music;

function printBoard(){
    var str = '';
    for(var i=0; i < 12; i++)
        for(var j=0; j < 12; j++)
            str = str + ' ' + board[i][j];
    alert(str);
}

$(document).ready(function(){


    $("#aLogout").click(function(){
        $(".content").fadeOut(500);
        setTimeout(function(){
            $("#login_registration").fadeIn(500);
        },500)

    });

    music = document.getElementById("music");

    //document.getElementById("aaa").pause();
    $("#aGame").click(openGamePage);
    $("#aAbout").click(function(){
       document.getElementById("aboutDialog").showModal();
    });
    $("#login_registration").fadeIn(500);
});


var users =
    [
        {
            userName: 'pav',
            password: 'ppppppp1',
            firstName: 'Pavel',
            lastName: 'Vaisburg',
            email: 'sadf@adfs.com',
            birthDay:'2015-12-5'
        },
        {
            userName: 'p1',
            password: 'p1p1p1p1',
            firstName: 'pp',
            lastName: 'ppL',
            email: 'sadf@adfs.com',
            birthDay:'2000-12-5'
        },
        {
            userName: 'test2015',
            password: 'test2015',
            firstName: 'test2015',
            lastName: 'test2015',
            email: 'test2015@gmail.com',
            birthDay:'2000-12-5'
        },
        {
            userName: 'p',
            password: '1',
            firstName: 'p',
            lastName: 'p',
            email: 'p@gmail.com',
            birthDay:'2000-12-5'
        }
    ];

function openGamePage(){
    $(".content").fadeOut(500);
    setTimeout(function(){
        $("#game").fadeIn(1000);
    },500);
}
function register(){
    var user = $("#txtRUserName").val();
    var pass = $("#txtRPass").val();
    var fName = $("#txtRName").val();
    var lName = $("#txtRLName").val();
    var email = $("#txtREmail").val();
    var bDate = $("#txtRDate").val();

    var regPass = new RegExp('^[a-z|A-Z|0-9][a-z|A-Z|0-9]+[a-z|A-Z|0-9][a-z|A-Z|0-9][a-z|A-Z|0-9][a-z|A-Z|0-9][a-z|A-Z|0-9][a-z|A-Z|0-9]$');
    var regNotNumbers = new RegExp('^[^0-9]+$');
    var regEmail = new RegExp('^([a-z|A-Z|0-9|_|\\.]+)\\@([a-z|A-Z]+\\.[a-z|A-Z|0-9]+(\\.[a-z|A-Z|0-9]+)*)');


    var newUser = {
        userName: user,
        password: pass,
        firstName: fName,
        lastName: lName,
        email: email,
        birthDay: bDate
    };


    if(user = '' || pass == '' || fName == '' || lName == '' || email == '' || bDate == '')
    {
        registerError();
    }
    else if( regPass.test(pass) && regNotNumbers.test(fName) && regNotNumbers.test(lName) && regEmail.test(email))
    {
        users.push(newUser);
        document.getElementById("registerForm").submit();
    }
    else{
        registerError();
    }
}

function login(){
    var user = $("#txtUserName").val();
    var pass =$("#txtPass").val();

    if(user == '' || pass == '' )
        loginError();
    else {
        for (var i = 0; i < users.length; i ++) {
            if (users[i].userName == user && users[i].password == pass) {
                executeLogin(user);
                return;
            }
        }

        loginError();
    }
}

function loginError(){
    $("#lblLoginError").css('visibility','visible');
}

function registerError(){
    $("#lblRegisterError").css('visibility','visible');
}

function executeLogin(user){
    $("#login_registration").hide();
    $("#userName").append(user.firstName + ' ' + user.lastName);
    $("#game").fadeIn(500);
    $("nav *").fadeIn(500);
}

function startGame(){
    var ballsCount = $("#txtBalls").val();
    var monstersCount = parseInt($("#monstersCount").val());

    if(ballsCount<50 || ballsCount>90){
        alert("Balls Must Be between 50 and 90");
        $("#txtBalls").val(50)
        return;
    }
    ballsCount = parseInt(ballsCount);
    var smallColor = $("#smallColor").val();
    var midColor = $("#midColor").val();
    var hightColor = $("#highColor").val();
    var time = parseInt($("#time").val());


    InitGame(ballsCount,monstersCount, time, smallColor, midColor, hightColor);

    document.getElementById("pacManDialog").showModal();
    $(document).on('keydown', function(e) {
        if(e.keyCode == 27) {
            Stop();
            return false;
        }
    });

    $("body").css('overflow', 'hidden');

    Start();


    music.play();
    music.onended = function(){
        music.play();
    }
}

function Stop(){
    document.getElementById("pacManDialog").close();
    $("body").css('overflow', 'auto');
    Pause();
    music.pause();
}
function HidePause(){
    $("#btnPause").hide();
    $("#btnStart").show();
}

function HideStart(){
    $("#btnStart").hide();
    $("#btnPause").show();
}