function addMolecule(labels, x0, y0, atomarray)
{
   for (var i=0;i<labels.length;i++)
   {
      var atom = new Atom();
      atom.pos.x=x0+i*2; atom.pos.y=y0;
      atom.vel.x=Math.random()*2.0-1.0;
      atom.vel.y=Math.random()*2.0-1.0;
      atom.label=labels[i];
      atom.bonds=[];
      atomarray.push(atom);
      if (i>0) 
      {
         atomarray[atomarray.length-1].bonds.push(
	    atomarray[atomarray.length-2]);
         atomarray[atomarray.length-2].bonds.push(
	    atomarray[atomarray.length-1]);
      }
   }
}

function Reaction(reac1, reac2, prod1, prod2, prebond, postbond)
{
   this.reac1=reac1;
   this.reac2=reac2;
   this.prod1=prod1;
   this.prod2=prod2;
   
   this.prebond=prebond;
   this.postbond=postbond;
}

function matchLabel(atom, label, wildcard)
{
   var widx=-1;
   
   if (atom.label[0]!=label[0])
   {
      switch (label[0])
      {
         case '*': widx=0; break;
	 case '&': widx=1; break;
	 case '%': widx=2; break;
	 case '^': widx=3; break;
	   
	 default:
	    return 0;
      }
   }
   if (widx!=-1)
   {
      if (!wildcard[widx]) wildcard[widx]=atom.label[0];
      else 
      {
         if (wildcard[widx]!=atom.label[0]) return 0;
      }
   }
 
   widx=-1;
   if (atom.label[1]!=label[1])
   {
      switch (label[1])
      {
         case '*': widx=0; break;
	 case '&': widx=1; break;
	 case '%': widx=2; break;
	 case '^': widx=3; break;
	 default:
	    return 0;
      }
   }
   
   if (widx!=-1)
   {
      if (!wildcard[widx]) wildcard[widx]=atom.label[1];
      else 
      {
         if (wildcard[widx]!=atom.label[1]) return 0;
      }
   }
   return 1;
}

function makeProduct(pstring, wildcard)
{
   var product=pstring.split("");
   var widx=-1;
   
   switch (pstring[0])
   {
      case '*': widx=0; break;
      case '&': widx=1; break;
      case '%': widx=2; break;
      case '^': widx=3; break;
   }
   
   if (widx != -1) product[0]=wildcard[widx]; 

   widx=-1;
   switch (pstring[1])
   {
      case '*': widx=0; break;
      case '&': widx=1; break;
      case '%': widx=2; break;
      case '^': widx=3; break;
   }
   
   if (widx != -1) product[1]=wildcard[widx];
       
   return product.join("");
}

Reaction.prototype.checkReactants = function(atom1, atom2, isbonded)
{
   var wildcard = []; // values of wildcard characters *, &, %, ^
   
   // Check bond status

   if ((this.prebond==1)&&(!isbonded)) return 0;
   if ((this.prebond==0)&&(isbonded)) return 0;   
   // if prebond=-1, that's a wildcard
   
   // First test atom1/atom2. If yes, return 1
   
   if (matchLabel(atom1,this.reac1,wildcard))
      if (matchLabel(atom2,this.reac2,wildcard))
      {
         return 1;
      }
   
   wildcard = [];
   // Then test atom2/atom1. If yes, react=2
   if (matchLabel(atom2,this.reac1,wildcard))
      if (matchLabel(atom1,this.reac2,wildcard))
      {
         return 2;
      }
      
   return 0;
};

Reaction.prototype.getProducts = function(atom1, atom2, isbonded)
{
   var wildcard = []; // values of wildcard characters *, &, %, ^
   var products = 
   {
      prod1: "",
      prod2: "",
      newbond: isbonded
   };
   
   // Check bond status

   if (this.postbond==1) products.newbond=true;  
   if (this.postbond==0) products.newbond=false;
   // if postbond=-1, that's a wildcard, which means keep current
   
   // First test atom1/atom2. If yes, return products in that order
   
   if (matchLabel(atom1,this.reac1,wildcard))
      if (matchLabel(atom2,this.reac2,wildcard))
      {
         products.prod1=makeProduct(this.prod1,wildcard);
	 products.prod2=makeProduct(this.prod2,wildcard);
	 
	 return products;
      }
   
   wildcard = [];
   // Then test atom2/atom1. If yes, react=2
   if (matchLabel(atom2,this.reac1,wildcard))
      if (matchLabel(atom1,this.reac2,wildcard))
      {
         products.prod1=makeProduct(this.prod2,wildcard);
	 products.prod2=makeProduct(this.prod1,wildcard);
	 
	 return products;
      }
      
   return products;
};

var reactions = 
[
   new Reaction("e8", "e0", "e4", "e3",  0,  1),
   new Reaction("*4", "&1", "*2", "&5", 1, 1),
   new Reaction("*5", "*0", "*7", "*6",  0,  1),
   new Reaction("*3", "&6", "*2", "&3", 0, 1),
   new Reaction("*7", "&3", "*4", "&3", 1, 1),
   new Reaction("f4", "f3", "f8", "f8", 1, 0),
   new Reaction("*2", "&8", "*9", "&1", 1, 1),
   new Reaction("*9", "&9", "*8", "&8", 1, 0)
];

function contains(arr, obj)
{
   for (var i=0;i<arr.length;i++)
      if (arr[i]==obj) return i;
      
   return null;
}

// blesh stackoverflow question response
function remove(arr, item) 
{
   for(var i = arr.length; i--;) 
   {
      if(arr[i] === item) 
      {
         arr.splice(i, 1);
      }
   }
}

function doReaction(atom1, atom2)
{
   var bond=contains(atom1.bonds,atom2);
   var isbonded=true;
   
   if (bond === null) isbonded=false;
   
   var possible=[];
   
   for (var i=0;i<reactions.length;i++)
   {
      if (reactions[i].checkReactants(atom1, atom2, isbonded))
      {
         possible.push(reactions[i]);
      }
   }   
   
   if (possible.length)
   {
      var j=Math.floor(Math.random()*possible.length);
      
      var products=possible[j].getProducts(atom1,atom2,isbonded);
      
      if (isbonded && !products.newbond)
      {
         remove(atom1.bonds,atom2);//.remove(atom2);
	 remove(atom2.bonds,atom1);//.remove(atom1);
      }
      
      if (!isbonded && products.newbond)
      {
         atom1.bonds.push(atom2);
	 atom2.bonds.push(atom1);
      }
      
      atom1.label=products.prod1;
      atom2.label=products.prod2;
   }
}
