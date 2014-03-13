// Point2D class
function Point2D( x, y ) {
    this.x = x;
    this.y = y;
};
// --------------------------------------
Point2D.prototype.add = function( p ) {
    this.x += p.x;
    this.y += p.y;
    return this;
};
// --------------------------------------
Point2D.prototype.sub = function( p ) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
};
// --------------------------------------
Point2D.prototype.mul = function( f ) {
    this.x *= f;
    this.y *= f;
    return this;
};
// --------------------------------------
Point2D.prototype.div = function( f ) {
    this.x /= f;
    this.y /= f;
    return this;
};
// --------------------------------------
Point2D.prototype.dist = function( p ) {
    return Math.sqrt( sqr( this.x - p.x ) + sqr( this.y - p.y ) );
};
// --------------------------------------
Point2D.prototype.len = function() {
    return Math.sqrt( sqr( this.x ) + sqr( this.y ) );
}
// --------------------------------------
Point2D.prototype.normalize = function() {
    return this.div( this.len() );
};
