const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Point
{
    x;
    y;    
    constructor(a,b){
        this.x = a;
        this.y = b;
    }
}

let PirosPontok = [];
let KekPontok = [];
let lepesmertek = 50;
let STOPCONDITION = 10000;
let penalty = 50


//init points
GenerateRedPoints();

//Pontok generálása és kirajzolása
GenerateBluePoints();

//origó
let origo = [new Point((1050+700)/2,(650+300)/2)];

Draw(KekPontok,PirosPontok,origo);

GetGlobalSum(KekPontok,PirosPontok);

STOHASTICHILLCLIMBING(STOPCONDITION);

function Tav(eiv,piv){ //Input: két pont Output: 1 int
    return eiv[0]*piv[1] - eiv[1]*piv[0];
}

function Iranyvektor(p1,p2){ //Input két array Output: 1 array

    let AB = [p2.x-p1.x, p2.y-p1.y]
    return AB
}

function GenerateBluePoints()
{
    KekPontok.push(new Point(1550,350));

    KekPontok.push(new Point(1750,950));
    
    KekPontok.push(new Point(1250,950));
    
    KekPontok.push(new Point(400,1000));

    KekPontok.push(new Point(200,200));

    KekPontok.push(new Point(1000,200));
}

function LineDraw(points){
    let leng = points.length;
    
    let i = 0;

    while(i <= leng){
        
        
        ctx.beginPath();
        if(i+1 == leng)
        {
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[0].x, points[0].y);
            ctx.stroke();

            break;
            
        } else{
            ctx.moveTo(points[i].x,points[i].y);
            ctx.lineTo(points[i+1].x,points[i+1].y);
            ctx.stroke();
        }
        i++;
    }
}

function PointDraw(points){

    for(item of points)
    {
        ctx.fillRect(item.x,item.y,10,10);
    }

}

function Draw(KekPontok,PirosPontok,origo)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.fillStyle = "blue";
    PointDraw(KekPontok);

    ctx.fillStyle = "red";
    PointDraw(PirosPontok);
    
    ctx.fillStyle = "green";
    PointDraw(origo)
    
    LineDraw(KekPontok);

    ctx.fill();
}

function GenerateRedPoints(){
    
    const x = 800;
    const y = 400;
    
    for(let i = 0;i < 10;i++ ){
        let rand1 = Math.floor(Math.random() * 550  - (Math.random() * 300));
        let rand2 = Math.floor(Math.random() * 350  -  (Math.random() * 100));
        
        let temp = new Point(800+rand1, 400+rand2);
        PirosPontok.push(temp);
    }


}


async function STOHASTICHILLCLIMBING(STOPCONDITION){

    for(let i = 0; i < STOPCONDITION; i++){
        let previous = GetGlobalSum(KekPontok,PirosPontok);
        let rand = Math.floor(Math.random() * (KekPontok.length-1));
        let randomelement = KekPontok[rand];
        let tempPoint= new Point(randomelement.x,randomelement.y);

        randomelement.x += Math.floor((Math.random() * lepesmertek) - (lepesmertek/2)); 
        randomelement.y += Math.floor((Math.random() * lepesmertek) - (lepesmertek/2));

        KekPontok[rand] = randomelement;
        let current = GetGlobalSum(KekPontok,PirosPontok);

        
        if(current <= previous){
            KekPontok[rand] = randomelement;
            Draw(KekPontok,PirosPontok,origo);
            console.log(current);
            await new Promise(r => setTimeout(r, 300));  
        }
        else{
            //rossz volt a change, ne allowoljuk.
            KekPontok[rand] = tempPoint;
        }
        
        /*
        console.log(global)
        console.log(globaltemp)
        console.log(tempPoint)
        console.log(randomelement);*/
    }
}

function GetGlobalSum(KekPontok,PirosPontok)
{
    let leng = KekPontok.length
    let iv = 0;
    let temppiv = 0;
    let global = 0;

    for(let i = 0; i < KekPontok.length;i++){
        if(i == leng-1)
        {
            
            iv = Iranyvektor(KekPontok[i],KekPontok[0]);

            for(let j = 0; j < PirosPontok.length;j++){
                temppiv = Iranyvektor(KekPontok[i],PirosPontok[j]);
                let check = Tav(iv,temppiv);
                if(check < 0){
                    global += Infinity
                }
                else{
                    global += check;
                }
            }
            
        } else{
            
            iv = Iranyvektor(KekPontok[i],KekPontok[i+1]);

            for(let j = 0; j < PirosPontok.length;j++){
                temppiv = Iranyvektor(KekPontok[i],PirosPontok[j]);
                let check = Tav(iv,temppiv);
                if(check < 0){
                    global = Infinity
                }
                else{
                    global += check;
                }
            }
                
        }
    }
    return global;
}