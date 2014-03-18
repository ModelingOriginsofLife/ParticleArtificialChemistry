var interactionMatrix = [];

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
            atomarray[atomarray.length-1].bonds.push( atomarray[atomarray.length-2] );
            atomarray[atomarray.length-2].bonds.push( atomarray[atomarray.length-1] );
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

Reaction.prototype.reverseReaction = function()
{
   var newReaction = new Reaction(this.prod1, this.prod2, this.reac1,
                                  this.reac2, this.postbond, this.prebond);
   return newReaction;
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

            default:  return 0;
        }
    }
    if (widx!=-1)
    {
        if (!wildcard[widx]) 
        {
            wildcard[widx]=atom.label[0];
        }
        else 
        {
            if (wildcard[widx]!=atom.label[0]) 
            {
                return 0;
            }
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
        if (!wildcard[widx]) 
        {
            wildcard[widx]=atom.label[1];
        }
        else 
        {
            if (wildcard[widx]!=atom.label[1]) 
            {
                return 0;
            }
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
   
   if (widx != -1) 
   {
       product[0]=wildcard[widx]; 
   }

   widx=-1;
   switch (pstring[1])
   {
      case '*': widx=0; break;
      case '&': widx=1; break;
      case '%': widx=2; break;
      case '^': widx=3; break;
   }
   
   if (widx != -1)
   {
       product[1]=wildcard[widx];
   }
       
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

Reaction.prototype.deltaE = function(atom1, atom2, isbonded)
{
   var prebond=isbonded;
   var postbond=isbonded;
   
   if (this.postbond==1) postbond=true;
   if (this.postbond==0) postbond=false;
   
   var previous=0.0, post=0.0;
   
   if (prebond) previous=interactionMatrix[atom1.label[0]+atom2.label[0]];
   if (postbond) post=interactionMatrix[atom1.label[0]+atom2.label[0]];

   return post-previous;
}

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
   /* // 2002 ruleset: works when single atoms can easily cross a bond
   new Reaction("e8", "e0", "e4", "e3",  0,  1),
   new Reaction("*4", "&1", "*2", "&5", 1, 1),
   new Reaction("*5", "*0", "*7", "*6",  0,  1),
   new Reaction("*3", "&6", "*2", "&3", 0, 1),
   new Reaction("*7", "&3", "*4", "&3", 1, 1),
   new Reaction("f4", "f3", "f8", "f8", 1, 0),
   new Reaction("*2", "&8", "*9", "&1", 1, 1),
   new Reaction("*9", "&9", "*8", "&8", 1, 0)
   */

   // adapted from 2007 paper, allows bonding from either side
   // so more suitable for a continuous-space simulation
/*   new Reaction( "e8", "e0", "e2", "e3", 0, 1 ),
   new Reaction( "*2", "&1", "*7", "&4", 1, 1 ),
   new Reaction( "*4", "&3", "*5", "&7", 0, 1 ),
   new Reaction( "*5", "*0", "*6", "*6", 0, 1 ),
   new Reaction( "*6", "&7", "*3", "&4", 0, 1 ),
   new Reaction( "*6", "&4", "*1", "&2", 1, 0 ),
   new Reaction( "*7", "&1", "*2", "&2", 1, 1 ),
   new Reaction( "f2", "f3", "f8", "f8", 1, 0 ),
   new Reaction( "*2", "&8", "*9", "&1", 1, 1 ),
   new Reaction( "*9", "&9", "*8", "&8", 1, 0 )*/
   
   // Template directed synthesis attempt
/*   new Reaction("*0","*1","*3","*6",0,1),
   new Reaction("*3","&3","*4","&4",0,1),
   new Reaction("*3","&4","*3","&5",0,1),
   new Reaction("*4","&4","*5","&5",0,1),
   new Reaction("*4","&4","*5","&5",1,1),
   new Reaction("*5","*6","*1","*2",1,0),

   new Reaction("*0","*2","*7","*A",0,1),
   new Reaction("*7","&7","*8","&8",0,1),
   new Reaction("*7","&8","*7","&9",0,1),
   new Reaction("*8","&8","*9","&9",0,1),
   new Reaction("*8","&8","*9","&9",1,1),
   new Reaction("*9","*A","*2","*1",1,0),*/
   
   // A version of the 2002 ruleset that allows for reversibility
   /*new Reaction("e8","e0","e2","e3",0,1),
   new Reaction("*2","&1","*7","&4",1,1),
   new Reaction("*4","&3","*5","&7",0,1),
   new Reaction("*5","*0","*6","*B",0,1),
   new Reaction("*B","&7","*3","&4",0,1),
   new Reaction("*6","&4","*1","&2",1,0),
   new Reaction("*7","&1","*A","&2",1,1),
   new Reaction("*A","&1","*7","&4",1,1),
   new Reaction("f2","f3","f8","fD",1,0),
   new Reaction("*2","&D","*9","&1",1,1),
   new Reaction("*A","&8","*C","&1",1,1),
   new Reaction("*C","&9","*8","&D",1,0),
   new Reaction("*D","&1","*8","&1",1,1)*/
   
    // A version of Dave Mann's message-passing replicator
    new Reaction( "*1", "&D", "*D", "&1", 1, 1 ), // message-passing
    new Reaction( "*2", "&D", "*D", "&2", 1, 1 ),
    new Reaction( "*3", "&D", "*D", "&3", 1, 1 ),
    new Reaction( "*4", "&D", "*D", "&4", 1, 1 ),
    new Reaction( "*5", "&D", "*D", "&5", 1, 1 ),
    new Reaction( "*6", "&D", "*D", "&6", 1, 1 ),
    new Reaction( "*7", "a0", "*D", "aE", 0, 1 ), // bond the appropriate type
    new Reaction( "*8", "b0", "*D", "bE", 0, 1 ),
    new Reaction( "*9", "c0", "*D", "cE", 0, 1 ),
    new Reaction( "*A", "d0", "*D", "dE", 0, 1 ),
    new Reaction( "*B", "e0", "*D", "eE", 0, 1 ),
    new Reaction( "*C", "f0", "*D", "fE", 0, 1 ),
    new Reaction( "*1", "&E", "*D", "&7", 1, 1 ), // activate for the next one to the bonded
    new Reaction( "*2", "&E", "*D", "&8", 1, 1 ),
    new Reaction( "*3", "&E", "*D", "&9", 1, 1 ),
    new Reaction( "*4", "&E", "*D", "&A", 1, 1 ),
    new Reaction( "*5", "&E", "*D", "&B", 1, 1 ),
    new Reaction( "eD", "*D", "e5", "*F", 1, 1 ), // reset starts at the top
    new Reaction( "eE", "*D", "e5", "*F", 1, 1 ), // reset starts at the bottom
    new Reaction( "aF", "*D", "a1", "*F", 1, 1 ), // reset passes over a base
    new Reaction( "bF", "*D", "b2", "*F", 1, 1 ),
    new Reaction( "cF", "*D", "c3", "*F", 1, 1 ),
    new Reaction( "dF", "*D", "d4", "*F", 1, 1 ),
    new Reaction( "fF", "fF", "fC", "fC", 1, 0 ) // final unbonding
    
];

function setupInteractionMatrix()
{
   var chararray = ['a','b','c','d','e','f','g'];
   
   for (var j=0;j<7;j++)
     for (var i=0;i<=j;i++)
     {
        var energy=-0.5;
        interactionMatrix[chararray[i]+chararray[j]]=energy;
        interactionMatrix[chararray[j]+chararray[i]]=energy;
     }     
}

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

function doReaction( atom1, atom2 )
{
    var bond=contains(atom1.bonds,atom2);
    var isbonded=true;
    if (bond === null) isbonded=false;

    var vbar=atom1.vel.add(atom2.vel); 
    vbar = vbar.mul(0.5);

    var dv=atom1.vel.sub(vbar);
    var energy=dot(dv,dv); 

    if (energy<1e-4) energy=1e-4;

    dv = dv.mul(1.0/Math.sqrt(energy));

    var possible=[];

    for (var i=0;i<reactions.length;i++)
    {
        if (reactions[i].checkReactants(atom1, atom2, isbonded))
        {
            if ( !withReversibility || energy>=reactions[i].deltaE(atom1,atom2,isbonded) )
            {
                possible.push(reactions[i]);
            }
        }
      
        if( withReversibility )
        {
            var reverse=reactions[i].reverseReaction();

            if (reverse.checkReactants(atom1, atom2, isbonded))
            {
                if (energy>=reverse.deltaE(atom1,atom2,isbonded))
                {
                    possible.push(reverse);
                }
            }
        }
    }   

    if (possible.length)
    {
        var j = Math.floor(Math.random()*possible.length);

        var products=possible[j].getProducts(atom1,atom2,isbonded);

        if( withReversibility )
        {
            energy -= possible[j].deltaE( atom1, atom2, isbonded );
        }

        dv = dv.mul( Math.sqrt(energy) );      
        atom1.vel = vbar.add( dv );
        atom2.vel = vbar.sub( dv );
        /*     
        console.log(possible[j].reac1+(possible[j].prebond ? "" : " + ")+possible[j].reac2+" -> " +
        possible[j].prod1+(possible[j].postbond ? "" : " +")+possible[j].prod2+
        "; Atoms: "+atom1.label+", "+atom2.label);
        */	  
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
