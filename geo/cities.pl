#!/usr/bin/perl

$file = "/Users/stuartlowe/Downloads/cities15000.txt";
open(FILE,$file);
@lines = <FILE>;
close(FILE);
$n = @lines;
$delim = "\t";

#-sort 15 -cols 2,3,5,6,9,15 -o reverse -m "\tVienna"

@result;

$sortby = 'population';
$order = "reverse";

for($i = 0 ; $i < $n; $i++){
	$lines[$i] =~ s/[\n\r]//g;
	(@cols) = split($delim,$lines[$i]);
	if($cols[14] >= 15000){
		push(@result,{'id'=>$cols[0],'population'=>$cols[14],'name'=>$cols[1],'ascii'=>$cols[2],'alt'=>$cols[3],'latitude'=>$cols[4],'longitude'=>$cols[5],'cc'=>$cols[8],'admin1'=>$cols[10]});
	}
}
@result = orderit(@result);

open(FILE,">","cities.txt");
print FILE "id\tname\tasciiname\taltname\tlatitude\tlongitude\tcc\tadmin1\tpopulation\n";
for($i = 0; $i < (@result);$i++){
	if($i > 0){ print FILE "\n"; }
	print FILE $result[$i]->{'id'}.$delim.$result[$i]->{'name'}.$delim.$result[$i]->{'ascii'}.$delim.$result[$i]->{'alt'}.$delim.$result[$i]->{'latitude'}.$delim.$result[$i]->{'longitude'}.$delim.$result[$i]->{'cc'}.$delim.$result[$i]->{'admin1'}.$delim.$result[$i]->{'population'};
}
close(FILE);



sub orderit {
	my @in = @_;
	my @sorted = ($in[0]->{$column} =~ /[a-zA-Z]/) ? (sort { lc($a->{$sortby}) cmp lc($b->{$sortby}) } @in) : (sort { $a->{$sortby} <=> $b->{$sortby} } @in);
	if($order eq "reverse"){ @sorted = reverse(@sorted); }
	return @sorted;
}
