function Atom()
{
   this.pos = new Point2D(0,0);
   this.vel = new Point2D(0,0);
   this.label="a0";
   this.bonds=[];
   this.next=null;
}

// Returns null or a structure containing collision
// parameters dr and r2 (r^2)

function getCollision(atom1, atom2)
{
   var dr = atom1.pos.sub(atom2.pos);
   
   var r2=dot(dr,dr);
   
   // radius = 1, so 2 radii is 2, so 2 radii squared is 4
   if (r2<=4.0)
   {
      return {
        dr: dr,
        r2: r2
      };
   }
   else return null;
}

function doCollision(atom1, atom2, cparam)
{
   var vcm=atom1.vel.add(atom2.vel);
   vcm=vcm.mul(0.5);
   
   var dv=atom1.vel.sub(vcm);
   var r=Math.sqrt(cparam.r2);
   
   var norm=cparam.dr.mul(1.0/r);
   
   var F=-2*dot(norm,dv);
   
   atom1.vel=vcm.add(dv.add(norm.mul(F)));
   atom2.vel=vcm.sub(dv.add(norm.mul(F)));
   
   var pcm=atom1.pos.add(atom2.pos);
   pcm=pcm.mul(0.5);
   
   var normalized_r = cparam.dr.mul(1.01/r);
   
   // Place atoms just barely in contact
   // normalized_r is unit-length version of atom1-atom2 (which has
   // length ~2)
   // so center of mass + normalized_r and center of mass - normalized_r
   // are the just-contacting positions of atom1 and atom2
   
   atom1.pos=pcm.add(normalized_r);
   atom2.pos=pcm.sub(normalized_r);
}

var xSize, ySize;

function sortToGrid(atomarray)
{   
   var particleGrid = [];
   var gridX=xSize/2,gridY=ySize/2;
   
   //particleGrid.resize(gridX*gridY);
   
    for (var i=0;i<gridX*gridY;i++)
      particleGrid[i]=null;
      
    for (var i=0;i<atomarray.length;i++)
    {
      var x,y;
      
      x=Math.floor(atomarray[i].pos.x/2);
      y=Math.floor(atomarray[i].pos.y/2);
      
      if ((x>=0)&&(y>=0)&&(x<gridX)&&(y<gridY))
      {
        if (!particleGrid[x+y*gridX])
        {
            atomarray[i].next=null;
            particleGrid[x+y*gridX]=atomarray[i];
        }
        else
        {
            atomarray[i].next=particleGrid[x+y*gridX];
            particleGrid[x+y*gridX]=atomarray[i];
        }
      }
    }
   
   return particleGrid;
}

function applyBoundary(atom)
{
   if (atom.pos.x<0)
   {
      atom.pos.x=0;
      atom.vel.x*=-1;
   }
   if (atom.pos.x>xSize)
   {
      atom.pos.x=xSize;
      atom.vel.x*=-1;
   }

   if (atom.pos.y<0)
   {
      atom.pos.y=0;
      atom.vel.y*=-1;
   }
   if (atom.pos.y>ySize)
   {
      atom.pos.y=ySize;
      atom.vel.y*=-1;
   }
}

function iterateBonds(atomarray, dt)
{
   for (var i=0;i<atomarray.length;i++)
   {
      for (var j=0;j<atomarray[i].bonds.length;j++)
      { 
         var dr=atomarray[i].pos.sub(atomarray[i].bonds[j].pos);
	 
	 atomarray[i].vel = (atomarray[i].vel.sub(dr.mul(0.25*dt)));
      }
   }
}

function iterateMotion(atomarray, dt)
{
   for (var i=0;i<atomarray.length;i++)
   {
      var dv = atomarray[i].vel.mul(dt);
      atomarray[i].pos = atomarray[i].pos.add(dv);
      applyBoundary(atomarray[i]);
   }
}

function doCollisions(atomarray)
{
   var pgrid=sortToGrid(atomarray);
   var gridX=xSize/2,gridY=ySize/2;
 
   for (var i=0;i<atomarray.length;i++)
   {
      var x0,y0,xm,ym;
      
      x0=Math.floor(atomarray[i].pos.x/2);
      y0=Math.floor(atomarray[i].pos.y/2);
      
      for (ym=y0-1;ym<=y0+1;ym++)
        for (xm=x0-1;xm<=x0+1;xm++)
	{
	   if ((xm>=0)&&(ym>=0)&&(xm<gridX)&&(ym<gridY))
	   {
	   var ptr=pgrid[xm+ym*gridX];
	   while (ptr)
	   {
	      if (ptr!=atomarray[i])
	      {
	         var cparam=getCollision(atomarray[i],ptr);
		 if (cparam)
		 {
		    doCollision(atomarray[i],ptr,cparam);		    
		    doReaction(atomarray[i],ptr);
		 }
	      }
	      ptr=ptr.next;	   
	   }
	   }
	}
   }
}

function iterateAll(atomarray, dt)
{
   iterateBonds(atomarray,dt);
   iterateMotion(atomarray,dt);
   doCollisions(atomarray);  
}