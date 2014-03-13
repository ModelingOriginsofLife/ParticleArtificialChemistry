function drawAtoms( atoms, context )
{
    for( var i = 0; i < atoms.length; ++i )
    {
        var atom = atoms[i];
        context.fillStyle = "rgb(200,200,200)";
        ctx.beginPath();
        ctx.arc( atom.pos.x, atom.pos.y, 10.0f, 0, 2*Math.PI );
        ctx.fill();
        ctx.closePath();
        context.beginPath();
    }
}