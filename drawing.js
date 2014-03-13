function drawAtoms( atoms, ctx )
{
    for( var i = 0; i < atoms.length; ++i )
    {
        var atom = atoms[i];
        ctx.fillStyle = "rgb(250,250,200)";
        ctx.beginPath();
        ctx.arc( atom.pos.x * 10.0, atom.pos.y * 10.0, 10.0, 0, 2*Math.PI );
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
    }
}