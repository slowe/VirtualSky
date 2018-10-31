#!/usr/bin/perl

open(FILE,"cities.txt");
@lines = <FILE>;
close(FILE);

%results;
%dbold;
%db;

foreach $line (@lines){
	$line =~ s/[\n\r]//g;
	($id,$name,$ascii,$alt,$lat,$lon,$cc,$admin1,$pop) = split(/\t/,$line);
	
	$pop2 = int($pop/15000);
	$lat = sprintf("%.4f",$lat);
	$lon = sprintf("%.4f",$lon);
	
	if($name eq $ascii){
		$line = "$id\t$name\t\t$cc\t$admin1\t$pop2";
	}else{
		$line = "$id\t$name\t$ascii\t$cc\t$admin1\t$pop2";	
	}

	if(!$ascii){ $ascii = $name; }
	$fl = "";
	if($ascii){
		$fl = lc(substr($ascii,0,1));
	}else{
#		$fl = lc(substr($name,0,1));
	}

	if($fl){
		$dbold{$id} = "$line";
		$n = @{$results{$fl}};
		if(!$n){ $n = 0 };
		
		if($name =~ /Mumbai/){
			#print "Mumbai = $fl-$n\n";
		}
		$db{$fl."-".$n} = "$lat\t$lon";
		push(@{$results{$fl}},$line);
	}
}

%cities;
$binning = 100;

foreach $l (keys(%results)){
	$n = @{$results{$l}};
	open(FILE,">","ranked-$l.tsv");
	for($i = 0; $i < $n; $i++){
		if($i > 0){ print FILE "\n"; } 
		$out = $results{$l}[$i];
		$out =~ s/^([^\t]+)\t//g;
		$id = $1;
		$j = int($i/$binning);
		$file = "cities/$l-$j.tsv";
		if($i == $j){
			# Remove the file
			if($file && -e $file){
				`rm $file`;
			}
		}
		if($out =~ /Mumbai/){
			#print "$l-$i\n";
		}
		#push(@{$cities{$l}},$i."\t".$db{$l."-".$i});
#		open(CITY,">","cities/".$l."-".$i.".tsv");
#		print CITY "".$db{$l."-".$i}."\n";
#		close(CITY);
		#push(@{$cities{$l}},$i."\t".$db{$l."-".$i});
		open(CITY,">>",$file);
		print CITY "$i\t".$db{$l."-".$i}."\n";
		close(CITY);
		print FILE "$out";
	}
	close(FILE);
}

#foreach $id (keys(%cities)){
#
#	@rows = @{$cities{$id}};
#	print "$id\n";
#	foreach $r (@rows){
#		print "\t".$r."\n";
#	}
#
#}
#print $results{'Z'};