function setup() {
  createCanvas(600, 800);
  noLoop();
}

function draw() {
  background(35, 25, 55);
  
  // Grid
  stroke(255, 255, 255, 40);
  strokeWeight(0.0);
  noFill();
  for (let x = 0; x <= width; x += width/13) line(x, 0, x, height);
  for (let y = 0; y <= height; y += height/10) line(0, y, width, y);

  // Shoulders - large dark triangle
fill(20, 20, 35);  // near black, dark jacket
noStroke();
triangle(
  2, 700,   // bottom left corner
  600, 650,  // bottom right corner
  380, 520   // peak - lines up with nose
);

// Lt Chest Higth Lite
noStroke();
fill(45, 35, 90);
triangle(
  300, 670,  // bottom left
  300, 730,  // top right up near temple
  2, 699   // bottom
);

//Rt Chest /  - base layer
fill(20, 20, 35);  //
noStroke();
rect(230, 650, 369, 200);


//Lt Chest /  - base layer
fill(20, 20, 35);  //
noStroke();
rect(2, 699, 369, 200);


// Shadow side - left face plane
fill(120, 20, 80);
noStroke();
rect(180, 270, 100, 230);

// Shadow left lower face plane
noStroke();
fill(90, 15, 65);
triangle(
  290, 470,  // bottom left
  190, 480,  // top right up near temple
  240, 630   // bottom
);

//cheel / face plane - base layer
fill(140, 110, 60);  // mid warm tone
noStroke();
rect(270, 420, 130, 200);  // spans full width behind brow

// Forehead / face plane - base layer
fill(180, 80, 20);  // mid warm tone
noStroke();
rect(270, 270, 220, 160);  // spans full width behind brow

// Brow ridge - dark triangle over left eye
fill(60, 0, 120);  // very dark
noStroke();
triangle(
  360, 450,  // bottom rt
  390, 360,  // top rt
  270, 360   // left
);
  
  // Nose highlight triangle - bright/light tone
fill(240, 180, 60);  // warm light - we'll go psychedelic later
noStroke();
triangle(
  237, 510,  // bottom left (start here per assignment)
  270, 375,  // top middle (bridge of nose)
  305, 500   // bottom right
);

  // Beard / mustache area - white beard
fill(200, 220, 240);  // off-white
noStroke();
rect(240, 550, 138, 80);

// Hair - dark left side
fill(45, 35, 90);
noStroke();
rect(190, 180, 120, 100);  // darker left portion

// Lit side face plane - right side connector
fill(180, 170, 150);  // warm mid-light
noStroke();
rect(395, 220, 100, 300);  // tall rectangle, top of silver hair down to beard

// Porkchop
noStroke();
fill(100, 200, 180);
triangle(
  490, 470,  // bottom left
  410, 480,  // top right up near temple
  380, 640   // bottom
);

// Hair - silver right side  
fill(80, 160, 120);
noStroke();
rect(320, 170, 160, 100);  // lighter silver right portion

  // Eyes
  noStroke();
  fill(0, 255, 200);  // dark iris
  ellipse(228, 395, 48, 32);  // left eye
  ellipse(350, 380, 50, 35);  // right eye

  // Title
fill(180, 180, 255);  // soft lavender text
noStroke();
textSize(24);
textAlign(CENTER);
text('Self Portrait', 300, 45);

// Title underline
stroke(180, 180, 255);  // same lavender as the title text
strokeWeight(1);
line(220, 55, 370, 55);  // adjust x values to match title width

  // Name
fill(180, 180, 255);  // soft lavender text
noStroke();
textSize(22);
textAlign();
text('Wade Pose', 500, 778);

// Point before signature
strokeWeight(5);
stroke(180, 180, 255);
point(430, 771);

}