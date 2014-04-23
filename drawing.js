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
        if( show_unbonded_atoms || atom.bonds.length )
        {
            var x = atom.pos.x + 1.0; // offset
            var y = atom.pos.y + 1.0; // offset
            
            ctx.fillStyle = getTypeColor( atoms[i].label[0] );
            ctx.beginPath();
            ctx.arc( x * scale, y * scale, scale, 0, 2*Math.PI );
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText( atoms[i].label[1], x * scale- 5, y * scale + 5 );
        
            for (var j = 0; j < atom.bonds.length; ++j)
            {
               var otheratom = atom.bonds[j];
               var ox = otheratom.pos.x + 1.0; // offset
               var oy = otheratom.pos.y + 1.0; // offset
               
               ctx.beginPath();
               ctx.moveTo( x * scale, y * scale );
               ctx.lineTo( ox * scale, oy * scale );
               ctx.stroke();
               ctx.closePath();
            }
        }
    }
}

function updateReactionList()
{
	//var rxnlist = "<ul>";
	
	/*
	for (var i=0;i<reactions.length;i++)
	{
		if (!reactions[i].reverse)
		{
			rxnlist = rxnlist + "<li>" + reactions[i].reac1 + (reactions[i].prebond ? "" : " + ") + 
				reactions[i].reac2 + " <-> " + reactions[i].prod1 + (reactions[i].postbond ? "" : " + ") + 
				reactions[i].prod2 + "; Forward: "+reactions[i].count+"; Backward: "+reactions[i].rcount +"</li>";
		}
	}
	*/
	
	/*
	for (var key in transitionMatrix)
	{
		rxnlist = rxnlist + "<li>" + key + " " + transitionMatrix[key] + "</li>";
	}
	
	rxnlist = rxnlist + "</ul>";
	reactionlist.innerHTML = rxnlist;*/
	
	var data = "digraph G {";
	
	for (var key in transitionMatrix)
	{
		var nodes = key.split(" ");
		
		data = data + "\"" + nodes[0] + "\"" + " -> " + "\"" + nodes[1] +"\" [label=\""+transitionMatrix[key]+"\"];";
	}
		
	data = data + "}";
	
	transitionGraph.setData({ dot: data});
}

function updateEnergy()
{
	var element = document.getElementById("energy");
	var E=0;
	
	for (var key in transitionMatrix)
	{
		var nodes = key.split(" ");
		var reverse = nodes[1] + " " + nodes[0];
		
		if (transitionMatrix[reverse])
		{
			E += (transitionMatrix[key] - transitionMatrix[reverse]) * Math.log(transitionMatrix[key] / transitionMatrix[reverse]);
		}
	}
	
	element.innerHTML = String(E);
}
