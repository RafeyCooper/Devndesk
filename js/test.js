
document.body.style.setProperty( "--dw", document.body.clientWidth + "px" );
document.body.style.setProperty( "--dh", document.body.clientHeight + "px" );
document.getElementById("cards").onpointermove = e => {
  for(const card of document.getElementsByClassName("card")) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top; 
    
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
    
  const BOX = card.getBoundingClientRect();
  const POINT = { x: x, y: y };
  const RATIO = { x: POINT.x / BOX.width, y: POINT.y / BOX.height };
  const CENTER = fromCenter( RATIO );
  // set some css variables referenced in css
  card.style.setProperty( "--ratio-x", RATIO.x );
  card.style.setProperty( "--ratio-y", RATIO.y );
  }
  
}


// maths 🤷‍♀️
function fromCenter({ x, y }) {
  return Math.min(Math.max( 0, Math.sqrt( (y - .5) * (y - .5) + (x  - .5) * (x - .5) ) / .5 ), 1 );
}