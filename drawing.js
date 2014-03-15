var scale = 10.0;

function getTypeColor(atomtype)
{
   switch (atomtype)
   {
      case 'a': return "rgb(250,60,60)"; break;
      case 'b': return "rgb(60,250,60)"; break;
      case 'c': return "rgb(60,60,250)"; break;
      case 'd': return "rgb(250,250,60)"; break;
      case 'e': return "rgb(250,60,250)"; break;
      case 'f': return "rgb(60,250,250)"; break;
      case 'g': return "rgb(250,250,200)"; break;
   }
}

function drawAtoms( atoms, ctx )
{
    ctx.font="18px Arial";
    for( var i = 0; i < atoms.length; ++i )
    {
        var atom = atoms[i];
        if (atom.bonds.length)
	{
        ctx.fillStyle = getTypeColor(atoms[i].label[0]);
        ctx.beginPath();
        ctx.arc( atom.pos.x * scale, atom.pos.y * scale, scale, 0, 2*Math.PI );
        ctx.fill();
        ctx.closePath();
	
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText(atoms[i].label[1], 
	   atom.pos.x * scale-5, 
	   atom.pos.y * scale+5);
	
	for (var j = 0; j < atom.bonds.length; ++j)
	{
	   var otheratom = atom.bonds[j];
	   
           ctx.beginPath();
	   ctx.moveTo( atom.pos.x * scale, atom.pos.y * scale);
	   ctx.lineTo( otheratom.pos.x * scale, otheratom.pos.y * scale );
	   ctx.stroke();
	   ctx.closePath();
	}
	}
    }
}