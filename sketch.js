var vertices = [];
var width;
var height;

class Vertex{
	constructor(){
		this.x = random(0, window.innerWidth);
		this.y = random(0, window.innerHeight);
		this.radius = random(3,10);
		this.dx = random(-2, 2);
		this.dy = random(-1.5, 1.5);
		this.s = random(0, Math.PI);
		this.sr = random(0, 3);
	}
	draw(){
		noStroke();
		fill('rgba(255,255,255,1)');
		circle(this.x,this.y,this.radius);
	}
	update(){
		let sinMotion = 0;
		if (sinMotion){
			this.s+= 0.01*this.sr;
			this.dx += Math.sin(this.s)*0.01;
			this.dy += Math.sin(this.s + Math.PI/4)*0.01;
		}
		let gravity = 0;
		if (gravity){
			if (this.x > (width/2+400) || this.x < (width/2-400)){ 
				if (this.x > width/2){
					this.dx -= (this.x - width/2) *0.001;
				} else {
					this.dx += (width/2 - this.x) *0.001;
				}
			}
			if (this.y > (height/2+400) || this.y < (height/2-400)){ 
				if (this.y > height/2){
					this.dy -= (this.y - height/2) *0.001;
				} else {
					this.dy += (height/2 - this.y) *0.001;
				}
			}
		}
		
		let mousePush = 0;
		if (mousePush){
			var mouseDist = Math.sqrt(Math.pow((mouseX-this.x),2) + Math.pow((mouseY-this.y),2));
			if (mouseDist < 200){
				let speed = 2 * 1/(mouseDist+1);
				let angle = Math.atan2(this.y - mouseY, this.x- mouseX);
				this.dx = this.speed* Math.cos(this.angle);
				this.dy = this.speed* Math.sin(this.angle);
			}
		}
		this.x += this.dx;
		this.y += this.dy;
		if (this.x < 0 || this.x > width){
			this.dx *= -1;
		}
		if (this.y < 0 || this.y > height){
			this.dy *= -1;
		}
	}
	drawEdgesWithinX(threshold){
		for (vertex of vertices){
			if (!(vertex === this)){
				var dist = Math.sqrt(Math.pow((vertex.x-this.x),2) + Math.pow((vertex.y-this.y),2));
				// console.log(dist);
				if (dist < threshold){
					stroke('rgba(255,255,255,0.5)');
					strokeWeight(1);
        			line(this.x,this.y,vertex.x,vertex.y);
					// drawCurvedLine(this, vertex, dist);
				}
			}
		}
	}
	drawNearestXEdges(x){
		var nearest = [];
		var nearestValues = [];
		for (var i = 0; i<vertices.length; i++){
			if (! (vertices[i] === this)){
				var dist = Math.sqrt(Math.pow((vertices[i].x-this.x),2) + Math.pow((vertices[i].y-this.y),2));
				if (nearest.length < x){
					nearest.push(vertices[i]);
					nearestValues.push(dist);
				} else {
					for (var j = 0; j<x; j++){
						if (dist < nearestValues[j]){
							nearest.splice(j, 1, vertices[i]);
							nearestValues.splice(j, 1, dist);
							break;
						}
					}
				}
			}
		} 
		console.log(nearest);
		for (var i = 0; i<nearest.length; i++){
			stroke('rgba(255,255,255,0.5)');
			strokeWeight(1);
			line(this.x,this.y,nearest[i].x,nearest[i].y);
		}
	}
	drawEdges(){
		this.drawEdgesWithinX(200);
		// this.drawNearestXEdges(3);
	}
}

function drawCurvedLine(a, b, dist){
	noFill();
	// let t = map(mouseX, 0, width, -5, 5);
	// curveTightness(t);
	beginShape();
	curveVertex(a.x, a.y);
	curveVertex(a.x, a.y);
	var dx = a.dx + b.dx;
	var dy = a.dy + b.dy;
	curveVertex(  ((a.x+b.x)/2)-(50*dx), ((a.y+b.y)/2)-(50*dy));
	// curveVertex(mouseX, mouseY);
	curveVertex(b.x, b.y);
	curveVertex(b.x, b.y);
	endShape();
}
function handleMouse(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
}
document.addEventListener("mousemove", handleMouse);

function setup(){
	width = window.innerWidth;
	height = window.innerHeight;
	createCanvas(width, height);
	for (var i=0; i<20; i++){
		vertices.push(new Vertex);
	}
}

function draw(){
	background('#0f0f0f');
	for (vertex of vertices){
		vertex.draw();
		vertex.update();
		vertex.drawEdges();
	}
}