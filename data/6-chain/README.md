This directory contains data for the replication of 6-atom replicators
for different bond strengths. The initial condition is two (different)
6-atom replicating strings.

The files energy*.txt have time-series data for different bond energies
given by the file-name. The first column is the simulation time in units of 
100 timesteps. The second column is the total energy used by the system up to 
that point, using the algorithm to extract that from the Markov chain 
representation. The third column is the number of replicators present at 
that time, using the states of the top atom of the chain for counting.

The file scaling.txt contains data relating the bond strength (first
column), the energy per replication (second column), and the overall 
growth rate (third column). The energy per replication is measured by
fitting the long-time behavior of the total energy used divided by the
number of replicators present minus the initial number of replicators to a
constant. The growth rate is measured by fitting to a*exp(b*t) and is in 
terms of the first column of the energy*.txt files.  