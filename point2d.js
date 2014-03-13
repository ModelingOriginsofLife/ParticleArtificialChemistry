// Point2D class
function Point2D( x, y ) {
    this.x = x;
    this.y = y;
};

// --------------------------------------
Point2D.prototype.add = function( p ) {
    return new Point2D( this.x + p.x, this.y + p.y);
};
// --------------------------------------
Point2D.prototype.sub = function( p ) {
    return new Point2D( this.x - p.x, this.y - p.y);
};
// --------------------------------------
Point2D.prototype.mul = function( f ) {
    return new Point2D( this.x * f, this.y * f );
};
// --------------------------------------
Point2D.prototype.div = function( f ) {
    return new Point2D( this.x / f, this.y / f );
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
