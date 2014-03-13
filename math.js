
function crossProduct2D( v, w ) { return v.x*w.y - v.y*w.x; }
// --------------------------------------
function add( a, b ) { return new Point2D( a.x + b.x, a.y + b.y ); }
// --------------------------------------
function sub( a, b ) { return new Point2D( a.x - b.x, a.y - b.y ); }
// --------------------------------------
function sqr( x ) { return x * x }
// --------------------------------------
function dist2( v, w ) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
// --------------------------------------
function dot( a, b ) {
    return a.x * b.x + a.y * b.y;
}
